import {
	ValidationProblemDetails,
	ProblemDetails,
	HedwigApi,
	Configuration,
	ProblemDetailsFromJSON,
	ValidationProblemDetailsFromJSON,
} from '../generated';
import { DeepNonUndefineable } from '../utils/types';
import { useContext, useEffect, useState } from 'react';
import AuthenticationContext from '../contexts/Authentication/AuthenticationContext';
import getCurrentHost from '../utils/getCurrentHost';

export type ApiError = ValidationProblemDetails | ProblemDetails;

interface ApiState<TData> {
	error: ApiError | null;
	data: TData | null;
}

export type ApiResult<TData> = [
	ApiError | null, // error
	DeepNonUndefineable<TData> // response
];

interface ApiParamOpts {
	skip?: boolean;
	callback?: () => void;
}

export default function useNewUseApi<TData>(
	query: (api: HedwigApi) => Promise<TData>,
	opts: ApiParamOpts = { skip: false, callback: () => null }
): ApiResult<TData> {
	// Get accessToken for authenticated API calls
	const { accessToken, withFreshToken } = useContext(AuthenticationContext);
	// And refresh on every render
	useEffect(() => {
		withFreshToken();
	});

	// Set initial api state
	const { skip, callback } = opts;
	const [state, setState] = useState<ApiState<TData>>({
		error: null,
		data: null,
	});
	const { error, data } = state;

	// Run query
	useEffect(() => {
		if (skip) {
			return;
		}

		const api = constructApi(accessToken);
		if (!api) {
			setState({ ...state, error: { detail: 'API not found' } });
			return;
		}

		// make API query
		query(api)
			.then(apiResult => {
				setState(_state => ({ ..._state, error: null, data: apiResult }));
			})
			.catch(async apiError => {
				const _error = await parseError(apiError);
				setState({ ...state, data: null, error: _error });
			});
	}, [accessToken, skip]);

	useEffect(() => {
		if (callback && !skip) callback();
	}, [state, skip]);

	// No loading because loading will never be true at this point
	return [error, data as DeepNonUndefineable<TData>];
}

const constructApi: (accessToken: string | null) => HedwigApi | null = (
	accessToken: string | null
) => {
	if (!accessToken) return null;

	return new HedwigApi(
		new Configuration({
			basePath: getCurrentHost(),
			apiKey: `Bearer ${accessToken}`,
		})
	);
};

const parseError: (error: any) => Promise<ApiError | null> = async (error: any) => {
	console.error(error);
	try {
		const jsonResponse = await error.json();
		if (error.status === 400) {
			return ValidationProblemDetailsFromJSON(jsonResponse) || null;
		} else {
			return ProblemDetailsFromJSON(jsonResponse) || null;
		}
	} catch (e) {
		console.error('Error cannot be converted to JSON');
		console.error(e);
		return ProblemDetailsFromJSON({
			detail: 'Inspect console for error',
			title: 'Unknown error',
		});
	}
};
