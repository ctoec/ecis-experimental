import { Validatable } from "./Validatable";
import { hasValidationErrors } from "./hasValidationErrors";
import { processValidationError } from "./processValidationError";
import { FormStatusProps } from "../../components/FormStatus/FormStatus";

export function warningForField<T extends Validatable>(
  field: string,
  entity: T | null,
  message?: string,
) : FormStatusProps | undefined {
  if(entity && hasValidationErrors(entity, [field])) {
    return {
      type: 'warning',
      message: message != undefined ? message : processValidationError(field, entity.validationErrors)
    };
  }
}

export function errorForField(
  fieldValue: any,
  attemptedSave: boolean,
  additionalCondition: boolean = true,
  message?: string,
) : FormStatusProps | undefined {
  if(!fieldValue && attemptedSave && additionalCondition) {
    return {
      type: 'error',
      message: message
    }
  }
}