import { ValidationError } from "../../generated";

export function processValidationError(field: string, errors?: ValidationError[] | null) {
	if (!errors) {
		return undefined;
	}
	const error = errors.find(error => error.field === field);
	return error ? (error.message || undefined) : undefined;
}