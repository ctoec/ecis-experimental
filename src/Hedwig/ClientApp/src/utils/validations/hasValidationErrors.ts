import { Validatable } from '.';
import { ValidationError } from '../../generated';

export function hasValidationErrors<T extends Validatable>(entity?: T | null, fields?: string[]) : boolean {
	const validationErrors = entity && entity.validationErrors;
	if (validationErrors) {
		if(fields) {
			const upperCaseFields = fields.map(field => field.toUpperCase());
			return validationErrors.some(error => hasErrorForField(error, upperCaseFields));
		}
		return validationErrors.length > 0;
	}
	return false;
}

function hasErrorForField(error: ValidationError, fields: string[]) {
	if(error.field) {
		if(fields.includes(error.field.toUpperCase())) return true;
	}

	if(error.fields) {
		if(error.fields.some(field=> fields.includes(field.toUpperCase()))) return true;
	}

	return false;
}