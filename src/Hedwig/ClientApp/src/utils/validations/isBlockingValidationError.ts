import { ApiError } from '../../hooks/useApi';
import { ValidationProblemDetails } from '../../generated';

export function isBlockingValidationError(error: ApiError): boolean {
	return !!(error as ValidationProblemDetails).errors;
}
