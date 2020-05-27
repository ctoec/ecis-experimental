import { FormStatusProps } from '../../components';
import { ApiError } from '../../hooks/useApi';
import { ValidationError } from '../../generated';
import { elementIdFormatter } from '../stringFormatters';
import { isBlockingValidationError } from './isBlockingValidationError';
import { SetStateAction, Dispatch } from 'react';

type ValidationResponse = ApiError | ValidationError[];

type ValidationDisplay = {
	type: 'error' | 'warning';
	response: ValidationResponse | null; // error: ApiError, warning: ValidationError[]
	field?: string;
	fields?: string[];
	message?: string;
	useValidationErrorMessage?: true;
	errorAlertState?: {
		// error: required, warning: never
		hasAlerted: boolean;
		alert: () => void;
	};
};

export function displayValidationStatus(
	validationDisplays: ValidationDisplay[]
): FormStatusProps | undefined {
	const validationMessages = validationDisplays.map(validationDisplay =>
		processValidationDisplay(validationDisplay)
	);
	// return the first validation message of the validationDisplays
	// array that has a validation message
	return validationMessages.filter(message => !!message)[0];
}

function processValidationDisplay(
	validationDisplay: ValidationDisplay
): FormStatusProps | undefined {
	const {
		response,
		type,
		field,
		fields,
		message,
		useValidationErrorMessage,
		errorAlertState,
	} = validationDisplay;
	const fieldValue = field ? [field] : fields;
	if (!fieldValue) {
		throw new Error('Either field or fields must be defined');
	}
	const errorMessage = getValidationStatus(response, fieldValue);
	if (errorMessage) {
		if (errorAlertState) {
			if (!errorAlertState.hasAlerted) {
				errorAlertState.alert();
			}
		}
		return {
			type: type,
			message: useValidationErrorMessage ? errorMessage : message,
			id: `${elementIdFormatter(fieldValue.join(' '))}-${type}`,
		};
	}
}

type ProcessErrorFunction<T> = (
	errorResponse: T | null | undefined,
	fields: string[]
) => string | undefined;

const getValidationStatus: ProcessErrorFunction<ValidationError[] | ApiError> = (
	errorResponse,
	fields
) => {
	if (!errorResponse) {
		return undefined;
	}

	if ((errorResponse as ApiError).status) {
		const response = errorResponse as ApiError;
		return getValidationProblem(response, fields);
	} else {
		const errors = errorResponse as ValidationError[];
		return getValidationError(errors, fields);
	}
};

const getValidationProblem: ProcessErrorFunction<ApiError> = (response, fields) => {
	if (!response) {
		return undefined;
	}

	if (!isBlockingValidationError(response)) {
		return undefined;
	}

	const errors = response.errors;
	if (!errors) {
		return undefined;
	}

	const messages = fields.map(field => {
		// This matches object fields that are contained in an array
		// e.g. fundings[1].familyid
		const fieldRegex = new RegExp(`^${field.split('.').join('(\\[.*\\])?.?')}$`, 'i');
		const error = Object.entries(errors).find(([key]) => key.match(fieldRegex));

		if (!error) {
			return undefined;
		}

		const [, messages] = error;
		// For now, just return the first blocking validation error message
		return messages[0];
	});
	// return the message for the first field in the fields array that has
	// a validation problem
	return messages.filter(message => !!message)[0];
};

const getValidationError: ProcessErrorFunction<ValidationError[]> = (errors, fields) => {
	if (!errors) {
		return undefined;
	}

	const messages = fields.map(field => {
		const upperCaseField = field.toUpperCase();
		const error = errors.find(error => {
			// Errors with `field` string
			if (error.field) {
				return upperCaseField === error.field.toUpperCase();
			}
			// Errors with `fields` array
			else if (error.fields) {
				return error.fields.map(f => f.toUpperCase()).includes(upperCaseField);
			}
		});
		if (!error) {
			return undefined;
		}
		return error.message || undefined;
	});
	// return the message for the first field in the fields array that has
	// a validation error
	return messages.filter(message => !!message)[0];
};
