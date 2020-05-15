import { hasValidationErrors } from './hasValidationErrors';
import { Validatable } from './Validatable';
import { FormStatusProps } from '../../components/FormStatus/FormStatus';

export function warningForFieldSet<T extends Validatable>(
	fieldSetId: string,
	fields: string[],
	entity: T | null,
	message: string,
	skipSubObjectValidations: boolean = false
): FormStatusProps | undefined {
	if (hasValidationErrors(entity, fields, skipSubObjectValidations)) {
		return {
			type: 'warning',
			message: message,
			id: `${fieldSetId}-warning`,
		};
	}
}
