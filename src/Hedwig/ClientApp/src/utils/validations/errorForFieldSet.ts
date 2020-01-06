import { hasValidationErrors } from "./hasValidationErrors";
import { Validatable } from "./Validatable";
import { FormStatusProps } from "../../components/FormStatus/FormStatus";

export function warningForFieldSet<T extends Validatable>(
  fieldSetId: string,
  fields: string[],
  entity: T | null,
  message: string,
): FormStatusProps | undefined {
  if(hasValidationErrors(entity, fields)) {
    return {
      type: 'warning',
      message: message,
      id: `${fieldSetId}-warning`,
    };
  }
}

export function errorForFieldSet(
  fieldSetId: string,
  fieldValues: any[],
  saveCondition: boolean,
  message: string
) : FormStatusProps | undefined {
  if(fieldValues.some(f => !f) && saveCondition) {
    return {
			type: 'error',
			message,
			id: `${fieldSetId}-error`,
		};
  }
}