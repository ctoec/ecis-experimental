import { ValidationError } from '../../generated';

export type Validatable = {
	validationErrors?: ValidationError[] | null;
};
