import {
	ValidationProblemDetails,
	ProblemDetails,
	HedwigApi,
	Configuration,
	BlobApiResponse,
	ProblemDetailsFromJSON,
	ValidationProblemDetailsFromJSON,
} from '../generated';
import { DeepNonUndefineable } from '../utils/types';
import { useContext, useEffect, useState } from 'react';
import AuthenticationContext from '../contexts/Authentication/AuthenticationContext';
import getCurrentHost from '../utils/getCurrentHost';

export type ApiError = ValidationProblemDetails | ProblemDetails;

interface ApiState<TData> {
	loading: boolean;
	error: ApiError | null;
	data: TData | null;
}

export type ApiResult<TData> = [
	boolean, //loading
	ApiError | null, // error
	DeepNonUndefineable<TData> // response
];

interface ApiParamOpts {
	skip: boolean;
}

export default function useNewUseApi<TData>(
	query: (api: HedwigApi) => Promise<TData>,
	opts: ApiParamOpts = { skip: false }
): ApiResult<TData> {
	// Get accessToken for authenticated API calls
	const { accessToken, withFreshToken } = useContext(AuthenticationContext);
	// And refresh on every render
	useEffect(() => {
		withFreshToken();
	});

	// Set initial api state
	const { skip } = opts;
	const [state, setState] = useState<ApiState<TData>>({
		loading: true,
		error: null,
		data: null,
	});
	const { loading, error, data } = state;

	// Run query
	useEffect(() => {
		if (skip) {
			setState({ ...state, loading: false });
			return;
		}

		const api = constructApi(accessToken);
		if (!api) {
			setState({ ...state, error: { detail: 'API not found' }, loading: false });
			return;
		}

		// make API query
		query(api)
			.then(apiResult => {
				setState(_state => ({ ..._state, loading: false, error: null, data: apiResult }));
			})
			.catch(async apiError => {
				const _error = await parseError(apiError);
				setState({ ...state, loading: false, data: null, error: _error });
			});
	}, [accessToken, skip]);

	// TODO: will loading not work because useEffect is always fired first?
	return [loading, error, data as DeepNonUndefineable<TData>];
}

const constructApi: (_accessToken: string | null) => HedwigApi | null = (
	_accessToken: string | null
) => {
	if (!_accessToken) return null;

	return new HedwigApi(
		new Configuration({
			basePath: getCurrentHost(),
			apiKey: `Bearer ${_accessToken}`,
		})
	);
};

const parseError: (_error: any) => Promise<ApiError | null> = async (_error: any) => {
	console.error(_error)
	try {
		const jsonResponse = await _error.json();
		if (_error.status === 400) {
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
