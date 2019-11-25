import { useContext, useEffect, useState } from 'react';
import { DefaultApi, Configuration } from '../OAS-generated';
import LoginContext from '../contexts/Login/LoginContext';

export default function useOASClient (query?: string, params?: any) {
	const [data, setData] = useState();
	const { accessToken, withFreshToken } = useContext(LoginContext);
	useEffect(() => {
		withFreshToken();
	});

  const api = accessToken ? new DefaultApi(new Configuration({ accessToken })) : null;

  const runQuery = async () => {
    if (!query || !api) {
      return;
    }
    const rval = await (api as any)[query](params);
    setData(rval);
  };

	useEffect(() => {
    runQuery();
	});

	return {
    data,
    runQuery,
  };
};
