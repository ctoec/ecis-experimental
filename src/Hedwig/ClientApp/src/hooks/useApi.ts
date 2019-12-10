import { useContext, useEffect, useState, DependencyList } from 'react';
import { Configuration, HedwigApi } from '../OAS-generated';
import LoginContext from '../contexts/Login/LoginContext';
import getCurrentHost from '../utils/getCurrentHost';

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
	(TData | undefined),
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

	const [state, setState] = useState<ApiState<TData>>({
		loading: true,
		error: null,
		skip,
		data: defaultValue,
	});
	const { loading, error, data } = state;

	const { accessToken, withFreshToken } = useContext(LoginContext);
	useEffect(() => {
		withFreshToken();
	});

	const api = accessToken
		? new HedwigApi(
				new Configuration({
					basePath: getCurrentHost(),
					apiKey: `Bearer ${accessToken}`,
				})
		  )
		: null;

	useEffect(() => {
		if (!api || skip) {
			setState({...state, loading: false});
			return;
		}

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

	const mutate: Mutate<TData> = (
	  query,
	  reducer = (_, result) => result,
	) => {
		if (!api) {
			setState({...state, loading: false});
			return Promise.reject("No api!");
		}


		return query(api).then((result) => {
			setState({ ...state, data: reducer(data, result)})
			return result;
		});
	};

	return [loading, error, data, mutate];
}
