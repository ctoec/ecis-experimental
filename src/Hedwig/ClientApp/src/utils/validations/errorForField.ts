import { Validatable } from "./Validatable";
import { hasValidationErrors } from "./hasValidationErrors";
import { processValidationError } from "./processValidationError";
import { FormStatusProps } from "../../components/FormStatus/FormStatus";
import { processBlockingValidationErrors } from "./processBlockingValidationErrors";
import { ValidationProblemDetails } from "../../generated";

export function warningForField<T extends Validatable>(
  fieldId: string,
  entity: T | null,
  message?: string,
) : FormStatusProps | undefined {
  if(entity && hasValidationErrors(entity, [fieldId])) {
    return {
			type: 'warning',
			message:
				message != undefined ? message : processValidationError(fieldId, entity.validationErrors),
			id: `${fieldId}-warning`,
		};
  }
}

/**
 * Parses an error response from the server,  and if error exists for specified field,
 * creates error-type FormStatusProps with either optional override message,
 * or message from error.
 * @param fieldId 
 * @param error 
 * @param message 
 */
export function serverErrorForField(
  fieldId: string,
  error?: ValidationProblemDetails,
  message?: string
) : FormStatusProps | undefined
{
  if(!error) return;

  const fieldError = processBlockingValidationErrors(
    fieldId, 
    error.errors
  );

  if(fieldError) {
    return {
      type: 'error',
      message: message ? message : fieldError,
      id: `${fieldId}-error`
    }
  }
}

/**
 * Based on supplied 
 * @param fieldId 
 * @param fieldValue 
 * @param saveCondition 
 * @param additionalCondition 
 * @param message 
 */
export function clientErrorForField(
  fieldId: string,
  fieldValue: any,
  saveCondition: boolean,
  message?: string,
) : FormStatusProps | undefined {
  if(!fieldValue && saveCondition) {
    return {
			type: 'error',
			message: message,
			id: `${fieldId}-error`,
		};
  }
}