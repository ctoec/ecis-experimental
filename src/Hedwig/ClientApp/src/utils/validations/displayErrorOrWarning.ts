import { Dispatch, SetStateAction } from 'react';
import { FormStatusProps } from '../../components';
import { serverErrorForField } from '.';
import { warningForField } from './errorForField';
import { warningForFieldSet } from './errorForFieldSet';
import { ValidationProblemDetails, ProblemDetails } from '../../generated';

export default function displayErrorOrWarning<T>(
	error: ValidationProblemDetails | ProblemDetails | null,
	options: {
		isFieldSet: boolean;
		fieldSetId?: string;
	},
	errorOptions?: {
		hasAlertedOnError: boolean;
		setHasAlertedOnError: Dispatch<SetStateAction<boolean>>;
		errorDisplays: {
			field: string;
			message?: string;
		}[];
	},
	warningOptions?: {
		object: T | null;
		field?: string;
		fields?: string[];
		message?: string;
	}
): FormStatusProps | undefined {
	if (error) {
		if (errorOptions) {
			return errorOptions.errorDisplays.reduce<FormStatusProps | undefined>(
				(serverError, errorDisplay) => {
					return (
						serverError ||
						serverErrorForField(
							errorOptions.hasAlertedOnError,
							errorOptions.setHasAlertedOnError,
							errorDisplay.field,
							error,
							errorDisplay.message
						)
					);
				},
				undefined
			);
		}
	} else {
		if (warningOptions) {
			if (options.isFieldSet) {
				return warningForFieldSet(
					options.fieldSetId as string,
					warningOptions.fields as string[],
					warningOptions.object,
					warningOptions.message as string
				);
			} else {
				return warningForField(
					warningOptions.field as string,
					warningOptions.object,
					warningOptions.message
				);
			}
		}
	}
}
