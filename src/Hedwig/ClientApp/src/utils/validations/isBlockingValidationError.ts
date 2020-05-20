import { ApiError } from '../../hooks/useApi';
import { ValidationProblemDetails } from '../../generated';

export function isBlockingValidationError(error: ApiError): error is ValidationProblemDetails {
	return !!(error as ValidationProblemDetails).errors;
}
