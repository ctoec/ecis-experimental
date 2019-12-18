import { Validatable } from '.';

export function hasValidationErrors<T extends Validatable>(entity: T) : boolean {
	let hasErrors = false;
	const validationErrors = entity.validationErrors;
	if (validationErrors) {
		hasErrors = validationErrors.length > 0;
	}
	return hasErrors;
}