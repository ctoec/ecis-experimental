import { Validatable } from '.';
import { ValidationError } from '../../generated';

export function hasValidationErrors<T extends Validatable>(entity?: T | null, fields?: string[], skipSubObjectValidations: boolean = false) : boolean {
	const validationErrors = entity && entity.validationErrors;
	if (validationErrors) {
		if(fields) {
			return validationErrors.some(error => errorIsFor(error, fields, skipSubObjectValidations));
		}
		return validationErrors.some(error => hasError(error, skipSubObjectValidations));
	}
	return false;
}

function errorIsFor(error: ValidationError, fields: string[], skipSubObjectValidations: boolean = false) {
	const upperCaseFields = fields.map(field => field.toUpperCase());

	// Errors with `field` string
	if(error.field) {
		// I dont understand why i have to do this, but if i don't the line below is mad
		const errorField = error.field; 
		const fieldMatch = upperCaseFields.find(field => field === errorField.toUpperCase());
		return fieldMatch && hasError(error, skipSubObjectValidations);
	}

	// Errors with `fields` array 
	else if(error.fields) {
		const fieldMatch = error.fields.find(field => upperCaseFields.includes(field.toUpperCase()));
		return fieldMatch && hasError(error, skipSubObjectValidations);
	}

	return false;
}

function hasError(error: ValidationError, skip: boolean) {
	return skip ? !error.isSubObjectValidation : true;
}