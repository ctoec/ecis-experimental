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
		field: string;
		hasAlertedOnError: boolean;
		setHasAlertedOnError: Dispatch<SetStateAction<boolean>>;
		message: string;
	},
	warningOptions?: {
		object: T | null;
		field?: string;
		fields?: string[];
		message: string;
	}
): FormStatusProps | undefined {
	if (error) {
		if (errorOptions) {
			return serverErrorForField(
				errorOptions.hasAlertedOnError,
				errorOptions.setHasAlertedOnError,
				errorOptions.field,
				error,
				errorOptions.message
			);
		}
	} else {
		if (warningOptions) {
			if (options.isFieldSet) {
				return warningForFieldSet(
					options.fieldSetId as string,
					warningOptions.fields as string[],
					warningOptions.object,
					warningOptions.message
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
