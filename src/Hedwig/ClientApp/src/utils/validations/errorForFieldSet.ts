import { hasValidationErrors } from "./hasValidationErrors";
import { Validatable } from "./Validatable";
import { FormErrorProps } from "../../components/FormError/FormError";

export function warningForFieldSet<T extends Validatable>(
  fields: string[],
  entity: T | null,
  message: string,
): FormErrorProps | undefined {
  if(hasValidationErrors(entity, fields)) {
    return {
      type: 'warning',
      message: message
    };
  }
}

export function errorForFieldSet(
  fieldValues: any[],
  attemptedSave: boolean,
  additionCondition: boolean = true,
  message: string
) : FormErrorProps | undefined {
  if(fieldValues.some(f => !f) && attemptedSave && additionCondition) {
    return {
      type: 'error',
      message
    };
  }
}