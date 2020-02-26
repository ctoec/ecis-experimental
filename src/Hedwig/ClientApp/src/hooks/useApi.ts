import {
	useContext,
	useEffect,
	useState,
	DependencyList,
	useCallback,
	Dispatch,
	SetStateAction,
} from 'react';
import {
	Configuration,
	HedwigApi,
	ValidationProblemDetailsFromJSON,
	ProblemDetailsFromJSON,
} from '../generated';
import getCurrentHost from '../utils/getCurrentHost';
import AuthenticationContext from '../contexts/Authentication/AuthenticationContext';
import { DeepNonUndefineable } from '../utils/types';
import { ValidationProblemDetails, ProblemDetails } from '../generated';
import { parseZone } from 'moment';

export type ApiError = ValidationProblemDetails | ProblemDetails;
export type Reducer<TData> = (data: TData, result: TData) => TData;
export type Query<TData> = (api: HedwigApi) => Promise<TData>;
export type Mutate<TData> = (
	query: Query<TData>,
	reducer?: Reducer<TData | undefined>
) => Promise<TData | void>;

interface ApiParamOpts<T> {
	defaultValue?: T;
	skip?: boolean;
	callback?: (_: T) => void;
}

interface ApiState<T> {
	loading: boolean;
	error: ApiError | null;
	data?: T;
	skip: boolean;
}

export type ApiResult<TData> = [
	boolean,
	ApiError | null,
	DeepNonUndefineable<TData>,
	Mutate<TData>
];

export default function useApi<TData>(
	query: (api: HedwigApi) => Promise<TData>,
	deps: DependencyList = [],
	opts?: ApiParamOpts<TData>
): ApiResult<TData> {
	const { defaultValue, skip, callback } = {
		defaultValue: undefined,
		skip: false,
		callback: undefined,
		...opts,
	};

	// Get accessToken for authentication
	const { accessToken, withFreshToken } = useContext(AuthenticationContext);

	// Every render, check if token is expired and refetch as needed
	useEffect(() => {
		withFreshToken();
	});

	// Set initial state
	const [state, setState] = useState<ApiState<TData>>({
		loading: true,
		error: null,
		skip,
		data: defaultValue,
	});
	const { loading, error, data } = state;

	// Construct API with null default
	const api = accessToken
		? new HedwigApi(
				new Configuration({
					basePath: getCurrentHost(),
					apiKey: `Bearer ${accessToken}`,
				})
		  )
		: null;

	// Create error parsing function
	const handleError = async (error: any) => {
		let jsonResponse: Object | null = null;
		try {
			jsonResponse = JSON.parse(await error.text());
		} catch {}

		let apiError: ApiError | null = null;
		if (jsonResponse) {
			if (error.status === 400) {
				apiError = ValidationProblemDetailsFromJSON(jsonResponse) || null;
			} else {
				apiError = ProblemDetailsFromJSON(jsonResponse) || null;
			}
		}

		setState(state => {
			return { ...state, error: apiError };
		});
	};

	// Create mutate function
	const mutate = useCallback<Mutate<TData>>(
		(_query, reducer = (_, result) => result) => {
			// If there is no API, throw error
			if (!api) {
				setState(_state => {
					return { ..._state, loading: false };
				});
				return Promise.reject('No api!');
			}

			// Invoke the supplied API method and update state with reducer
			return _query(api)
				.then(result => {
					setState(_state => {
						return { ..._state, data: reducer(data, result) };
					});
					return result;
				})
				.catch(async error => {
					await handleError(error);
				});
		},
		[api, data]
	);

	// Rerun query whenever deps or accessToken changes
	useEffect(() => {
		// If there is no access token, set data to undefined, loading to false, and exit
		if (!accessToken) {
			setState({ ...state, loading: false, data: undefined });
			return;
		}

		// If the API doesn't exist or skip is true, exit with loading false
		if (!api || skip) {
			setState({ ...state, loading: false });
			return;
		}

		// Invoke the supplied API method, and update state
		query(api)
			.then(result => {
				setState({ ...state, loading: false, error: null, data: result });
				if (callback) {
					callback(result);
				}
			})
			.catch(async error => {
				await handleError(error);
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [...deps, accessToken]);

	return [loading, error, data as DeepNonUndefineable<TData>, mutate];
}
