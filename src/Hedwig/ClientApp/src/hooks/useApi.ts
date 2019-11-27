import { useContext, useEffect, useState, DependencyList } from 'react';
import { HedwigApi, Configuration } from '../OAS-generated';
import LoginContext from '../contexts/Login/LoginContext';

interface apiState<T> {
	loading: boolean,
	error: string | null,
	data?: T,
}

type apiResult<T> = [boolean, (string | null), T?];

export default function useApi<T>(
  query: (api: HedwigApi) => Promise<T>,
  deps: DependencyList = [],
  defaultValue?: T
): apiResult<T> {
	const [state, setState] = useState<apiState<T>>({
		loading: true,
		error: null,
		data: defaultValue,
	});

	const { accessToken, withFreshToken } = useContext(LoginContext);
	useEffect(() => {
		withFreshToken();
	});

	const api = accessToken
		? new HedwigApi(
				new Configuration({
					basePath: 'https://localhost:5001',
					headers: { "Authorization": "Bearer " + accessToken },
				})
		  )
		: null;

	useEffect(() => {
		if (!api) { return; }

		query(api)
			.then((result) => setState({ loading: false, error: null, data: result }))
			.catch((error) => setState({ ...state, loading: false, error: error.toString() }));
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [...deps, accessToken]);

	const { loading, error, data } = state;
	return [loading, error, data];
}
