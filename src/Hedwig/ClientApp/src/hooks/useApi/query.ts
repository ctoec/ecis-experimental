import { useContext, useEffect, useState } from 'react';
import { DeepNonUndefineable } from '../../utils/types';
import AuthenticationContext from '../../contexts/Authentication/AuthenticationContext';
import { ApiExtraParamOpts, appendData } from './paginate';
import { constructApi, Api } from './api';
import { parseError, ApiError } from './error';

interface ApiState<TData> {
	error: ApiError | null; // error
	data: TData | null; // response
	loading: boolean;
	start: number;
	count: number;
}

export type ApiResult<TData> = {
	error: ApiError | null; // error
	data: DeepNonUndefineable<TData>; // response
	loading: boolean;
};

export interface ApiParamOpts<TData> {
	skip?: boolean;
	callback?: (data: TData | null) => void;
	deps?: any[];
	defaultValue?: TData;
	paginate?: boolean;
}

export default function useApi<TData>(
	query: (api: Api, opt?: ApiExtraParamOpts) => Promise<TData>,
	opts: ApiParamOpts<TData> = {
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
	const { skip, callback, deps, defaultValue, paginate } = opts;
	const [state, setState] = useState<ApiState<TData>>({
		error: null,
		data: defaultValue || null,
		loading: true,
		start: 0,
		count: 50,
	});

	// Run query
	useEffect(() => {
		if (skip) {
			setState({ ...state, loading: false });
			return;
		}

		setState({ ...state, data: defaultValue || null, error: null, loading: true });

		const api = constructApi(accessToken);
		if (!api) {
			setState({ ...state, loading: false, error: { detail: 'API not found' } });
			return;
		}

		// We are assuming TData is array-like if paginate is true
		if (paginate) {
			const paginatedQuery = (start: number, count: number) =>
				query(api, {
					start: start,
					count: count,
				})
					.then((apiResult) => {
						// Stop once we have retrieved all the data
						if (((apiResult as unknown) as any[]).length === 0) {
							// Need to use function syntax for state updates so pending updates aren't overwritten
							setState((s) => ({ ...s, loading: false }));
							return;
						}

						// Need to use function syntax for state updates so pending updates aren't overwritten
						setState((s) => ({
							...s,
							error: null,
							data: appendData(s.data, apiResult),
							loading: true,
						}));
						// Continue requesting data
						paginatedQuery(start + state.count, state.count);
					})
					.catch(async (apiError) => {
						const _error = await parseError(apiError);
						setState({ ...state, data: null, error: _error, loading: false });
					});
			// Kick off the first request
			paginatedQuery(state.start, state.count);
		} else {
			// make API query
			query(api)
				.then((apiResult) => {
					setState({ ...state, error: null, data: apiResult, loading: false });
				})
				.catch(async (apiError) => {
					const _error = await parseError(apiError);
					setState({ ...state, data: null, error: _error, loading: false });
				});
		}
	}, [accessToken, skip, ...(deps || [])]);

	useEffect(() => {
		if (callback && !skip && !state.loading) callback(state.data);
	}, [state, skip, callback]);

	return { ...state, data: state.data as DeepNonUndefineable<TData> };
}