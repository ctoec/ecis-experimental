import { useContext, useEffect, useState, DependencyList, useCallback } from 'react';
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

export type ApiError = ValidationProblemDetails | ProblemDetails;
export type Reducer<TData> = (data: TData, result: TData) => TData;
export type Query<TData> = (api: HedwigApi) => Promise<TData>;
export type Mutate<TData> = (
	query: Query<TData>,
	reducer?: Reducer<TData | undefined>
) => Promise<TData | null>;
// Null is the return value if the mutation fails

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
	const { accessToken, withFreshToken, loading: accessTokenLoading } = useContext(
		AuthenticationContext
	);

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

	// Create error handling functions
	const handleError = async (_error: any) => {
		const apiError = await parseError(_error);
		setState(_state => {
			return { ..._state, loading: false, error: apiError };
		});
	};

	const parseError: (_error: any) => Promise<ApiError | null> = async (_error: any) => {
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
			return {
				detail: 'Please inspect console for error',
				title: 'Unknown error',
			};
		}
	};

	// Create mutate function
	const mutate = useCallback<Mutate<TData>>(
		(_query, reducer = (_, result) => result) => {
			// If there is no API, throw error
			if (!api) {
				return Promise.reject('No api!');
			}

			// Invoke the supplied API method and update state with reducer
			return _query(api)
				.then(result => {
					setState(_state => {
						return { ..._state, loading: false, error: null, data: reducer(data, result) };
					});
					return result;
				})
				.catch(async apiError => {
					await handleError(apiError);
					return null;
					// If there was an error, return null
				});
		},
		[api, data]
	);

	// Rerun query whenever deps or accessToken changes
	useEffect(() => {
		// Do not attempt to make a request if we are still
		// waiting on the access token
		if (accessTokenLoading) {
			return;
		}

		// If there is no access token and it is done loading,
		// Then the user is not logged in so
		// Set data to undefined, loading to false, and exit
		if (!accessToken) {
			setState({ ...state, loading: false, data: undefined });
			return;
		}

		// If the API doesn't exist or skip is true, exit
		if (!api || skip) {
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
			.catch(async apiError => {
				await handleError(apiError);
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [...deps, accessToken, accessTokenLoading]);

	return [loading, error, data as DeepNonUndefineable<TData>, mutate];
}
