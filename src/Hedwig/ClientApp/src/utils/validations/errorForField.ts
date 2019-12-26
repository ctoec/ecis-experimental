import { Validatable } from "./Validatable";
import { hasValidationErrors } from "./hasValidationErrors";
import { processValidationError } from "./processValidationError";
import { FormError } from "../../components/FormGroup/FormGroup";

export function warningForField<T extends Validatable>(
  field: string,
  entity: T | null,
  message?: string,
) : FormError | undefined {
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
) : FormError | undefined {
  if(!fieldValue && attemptedSave && additionalCondition) {
    return {
      type: 'error',
      message: message
    }
  }
}