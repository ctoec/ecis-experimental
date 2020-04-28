import { Dispatch, SetStateAction } from 'react';
import { FormStatusProps } from '../../components';
import { serverErrorForField } from '.';
import { warningForField, clientErrorForField } from './errorForField';
import { warningForFieldSet } from './errorForFieldSet';
import { ValidationProblemDetails, ProblemDetails } from '../../generated';

export default function displayErrorOrWarning<T>(
	error: ValidationProblemDetails | ProblemDetails | null,
	options: {
		isFieldSet?: boolean;
		fieldSetId?: string;
		serverErrorOptions?: {
			hasAlertedOnError: boolean;
			setHasAlertedOnError: Dispatch<SetStateAction<boolean>>;
			errorDisplays: {
				field: string;
				message?: string;
			}[];
		};
		clientErrorOptions?: {
			errorDisplays: {
				fieldId: string;
				errorCondition: boolean;
				message?: string;
			}[];
		};

		warningOptions?: {
			object: T | null;
			field?: string;
			fields?: string[];
			message?: string;
		};
	}
): FormStatusProps | undefined {
	if (error) {
		if (options.serverErrorOptions) {
			const errorOpts = options.serverErrorOptions;
			return errorOpts.errorDisplays.reduce<FormStatusProps | undefined>(
				(serverError, errorDisplay) => {
					return (
						serverError ||
						serverErrorForField(
							errorOpts.hasAlertedOnError,
							errorOpts.setHasAlertedOnError,
							errorDisplay.field,
							error,
							errorDisplay.message
						)
					);
				},
				undefined
			);
		}
	} else if (options.clientErrorOptions) {
		const clientErrorOpts = options.clientErrorOptions;
		return clientErrorOpts.errorDisplays.reduce<FormStatusProps|undefined>((clientError, errorDisplay) => {
			return (
				clientError ||
				clientErrorForField(
					errorDisplay.fieldId,
					errorDisplay.errorCondition,
					errorDisplay.message
				)
			)
		}, undefined);
	}	else {
		if (options.warningOptions) {
			const warningOpts = options.warningOptions;
			if (options.isFieldSet) {
				return warningForFieldSet(
					options.fieldSetId as string,
					warningOpts.fields as string[],
					warningOpts.object,
					warningOpts.message as string
				);
			} else {
				return warningForField(
					warningOpts.field as string,
					warningOpts.object,
					warningOpts.message
				);
			}
		}
	}
}
