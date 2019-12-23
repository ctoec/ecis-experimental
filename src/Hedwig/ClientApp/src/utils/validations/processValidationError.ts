import { ValidationError } from "../../generated";

export function processValidationError(field: string, errors?: ValidationError[] | null) {
	if (!errors) {
		return undefined;
	}
	const error = errors.find(error => {
		if(!error.field) return false;
		return error.field.toUpperCase() === field.toUpperCase();
	});
	return error ? (error.message || undefined) : undefined;
}