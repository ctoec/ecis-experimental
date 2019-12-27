import { Validatable } from "./Validatable";
import { hasValidationErrors } from "./hasValidationErrors";
import { processValidationError } from "./processValidationError";
import { FormErrorProps } from "../../components/FormError/FormError";

export function warningForField<T extends Validatable>(
  field: string,
  entity: T | null,
  message?: string,
) : FormErrorProps | undefined {
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
) : FormErrorProps | undefined {
  if(!fieldValue && attemptedSave && additionalCondition) {
    return {
      type: 'error',
      message: message
    }
  }
}