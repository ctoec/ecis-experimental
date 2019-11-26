import { useContext, useEffect, useState } from 'react';
import { DefaultApi, Configuration } from '../OAS-generated';
import LoginContext from '../contexts/Login/LoginContext';

export default function useOASClient<TQueryParams, TData>(
	query?: string,
	params?: TQueryParams,
	skip: boolean = false
) {
	const [data, setData] = useState<TData>();
	const { accessToken, withFreshToken } = useContext(LoginContext);
	useEffect(() => {
		withFreshToken();
	});

	const api = accessToken ? new DefaultApi(new Configuration({ 
		basePath: "https://localhost:5001",
		accessToken 
	})) : null;

	const runQuery = async () => {
		console.log("begin runQuery");
		if (!query || !api) {
			return;
		}
		try {
			const rval = await (api as any)[query](params);
			setData(rval);
			console.log(rval);
		} catch (e) {
			// TODO: HANDLE ERRORS
			console.log("These are not the error messages you're looking for: ", e);
		}
	};

	useEffect(() => {
		console.log(JSON.stringify(params));
		if (!skip) {
			runQuery();
		}
	}, [query, accessToken, JSON.stringify(params)]);

	return { data };
}
