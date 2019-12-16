import { useContext, useEffect, useState, DependencyList, useCallback } from 'react';
import { Configuration, HedwigApi } from '../generated';
import getCurrentHost from '../utils/getCurrentHost';
import AuthenticationContext from '../contexts/Authentication/AuthenticationContext';
import { DeepNonUndefineable } from '../utils/types';

export type Reducer<TData> = (data: TData, result: TData) => TData;
export type Query<TData> = (api: HedwigApi) => Promise<TData>
export type Mutate<TData> = (
	query: Query<TData>,
	reducer?: Reducer<TData | undefined>
) => Promise<TData | undefined>

interface ApiParamOpts<T> {
	defaultValue?: T,
	skip?: boolean,
	callback?: (_: T) => void
}

interface ApiState<T> {
	loading: boolean,
	error: string | null,
	data?: T,
	skip: boolean,
}

type ApiResult<TData> = [
	boolean,
	(string | null),
	DeepNonUndefineable<TData>,
	Mutate<TData>
];

export default function useApi<TData>(
	query: (api: HedwigApi) => Promise<TData>,
	deps: DependencyList = [],
	opts?: ApiParamOpts<TData>
): ApiResult<TData> {
	const {
		defaultValue,
		skip,
		callback
	} = {
		defaultValue: undefined,
		skip: false,
		callback: undefined,
		...opts
	}

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
	const api = accessToken ? 
		new HedwigApi(
			new Configuration({
				basePath: getCurrentHost(),
				apiKey: `Bearer ${accessToken}`,
			})
		) : null;

	// Create mutate function
	const mutate = useCallback<Mutate<TData>>((
	  query,
	  reducer = (_, result) => result,
	) => {
		// If there is no API, throw error
		if (!api) {
			setState({ ...state, loading: false });
			return Promise.reject("No api!");
		}

		// Invoke the supplied API method and update state with reducer
		return query(api).then((result) => {
			setState({ ...state, data: reducer(data, result) })
			return result;
		});
	}, [api]);

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
			.then((result) => {
				setState({ ...state, loading: false, error: null, data: result });
				if (callback) {
					callback(result);
				}
			})
			.catch((error) => setState({ ...state, loading: false, error: error.toString() }));
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [...deps, accessToken]);

	return [loading, error, data as DeepNonUndefineable<TData>, mutate];
}
