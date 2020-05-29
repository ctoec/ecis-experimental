import {
	ValidationProblemDetailsFromJSON,
	ProblemDetailsFromJSON,
	ValidationProblemDetails,
	ProblemDetails,
} from '../../generated';

export type ApiError = ValidationProblemDetails | ProblemDetails;

export const parseError: (error: any) => Promise<ApiError | null> = async (error: any) => {
	try {
		const jsonResponse = await error.json();
		if (error.status === 400) {
			return ValidationProblemDetailsFromJSON(jsonResponse) || null;
		} else {
			return ProblemDetailsFromJSON(jsonResponse) || null;
		}
	} catch (e) {
		console.error('Error cannot be converted to JSON');
		console.error(error);
		return ProblemDetailsFromJSON({
			detail: 'Inspect console for error',
			title: 'Unknown error',
		});
	}
};
