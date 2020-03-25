import {
	ValidationProblemDetails,
	ProblemDetails,
	HedwigApi,
	Configuration,
	ProblemDetailsFromJSON,
	ValidationProblemDetailsFromJSON,
} from '../generated';
import { DeepNonUndefineable } from '../utils/types';
import { useContext, useEffect, useState, TdHTMLAttributes } from 'react';
import AuthenticationContext from '../contexts/Authentication/AuthenticationContext';
import getCurrentHost from '../utils/getCurrentHost';

export type ApiError = ValidationProblemDetails | ProblemDetails;

interface ApiState<TData> {
	error: ApiError | null; // error
	data: TData | null; // response
	loading: boolean;
}

export type ApiResult<TData> = {
	error: ApiError | null; // error
	data: DeepNonUndefineable<TData>; // response
	loading: boolean;
};

interface ApiParamOpts {
	skip?: boolean;
	callback?: () => void;
	deps?: any[];
}

export default function useNewUseApi<TData>(
	query: (api: HedwigApi) => Promise<TData>,
	opts: ApiParamOpts = {
		skip: false,
	}
): ApiResult<TData> {
	// Get accessToken for authenticated API calls
	const { accessToken, withFreshToken } = useContext(AuthenticationContext);
	// And refresh on every render
	useEffect(() => {
		withFreshToken();
	});

	// Set initial api state
	const { skip, callback, deps } = opts;
	const [state, setState] = useState<ApiState<TData>>({
		error: null,
		data: null,
		loading: true,
	});

	// Run query
	useEffect(() => {
		if (skip) {
			setState({ ...state, loading: false });
			return;
		}

		setState({ ...state, loading: true });

		const api = constructApi(accessToken);
		if (!api) {
			setState({ ...state, loading: false, error: { detail: 'API not found' } });
			return;
		}

		// make API query
		query(api)
			.then(apiResult => {
				setState({ error: null, data: apiResult, loading: false });
			})
			.catch(async apiError => {
				const _error = await parseError(apiError);
				setState({ data: null, error: _error, loading: false });
			});
	}, [accessToken, skip, ...(deps || [])]);

	useEffect(() => {
		if (callback && !skip && (state.data || state.error)) callback();
	}, [state, skip]);

	// No loading because loading will never be true at this point
	return { ...state, data: state.data as DeepNonUndefineable<TData> };
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
