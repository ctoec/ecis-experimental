import { ValidationError } from "../generated";

type Validateable = {
	validationErrors?: ValidationError[] | null,
}

export default function hasValidationErrors<T extends Validateable>(entity: T) : boolean {
	let hasErrors = false;
	const validationErrors = entity.validationErrors;
	if (validationErrors) {
		hasErrors = validationErrors.length > 0;
	}
	return hasErrors;
}