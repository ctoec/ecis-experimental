import { Validatable } from "./Validatable";
import { hasValidationErrors } from "./hasValidationErrors";
import { processValidationError } from "./processValidationError";
import { FormStatusProps } from "../../components/FormStatus/FormStatus";

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

export function errorForField(
  fieldId: string,
  fieldValue: any,
  attemptedSave: boolean,
  additionalCondition: boolean = true,
  message?: string,
) : FormStatusProps | undefined {
  if(!fieldValue && attemptedSave && additionalCondition) {
    return {
			type: 'error',
			message: message,
			id: `${fieldId}-error`,
		};
  }
}