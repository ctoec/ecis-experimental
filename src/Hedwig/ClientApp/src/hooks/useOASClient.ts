import { useContext, useEffect, useState } from 'react';
import { DefaultApi, Configuration } from '../OAS-generated';
import LoginContext from '../contexts/Login/LoginContext';

export default function useOasClient (query?: string, params?: any) {
	const [user, setUser] = useState();
	const [data, setData] = useState();

	const { accessToken, withFreshToken } = useContext(LoginContext);
	useEffect(() => {
		withFreshToken();
	}, []);

  const api = accessToken ? new DefaultApi(new Configuration({ accessToken })) : null;
  // TODO: NEED USER IN MOCKED DATA?
  // const retrievedUser = await api.usersCurrentGet();
  // setUser(retrievedUser);

  const runQuery = async () => {
    if (!query || !api) {
      return;
    }
    const rval = await (api as any)[query](params);
    setData(rval)
  };

	useEffect(() => {
    runQuery()
	}, [user]);

	return {
    data,
    runQuery,
  };
};
