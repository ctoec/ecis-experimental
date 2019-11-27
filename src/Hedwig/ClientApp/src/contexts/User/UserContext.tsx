import React from 'react';
import useApi from '../../hooks/useApi';
import { User } from '../../OAS-generated/models/User';

export type UserContextType = {
	user?: User;
};

const UserContext = React.createContext<UserContextType>({
	user: undefined,
});

const { Provider, Consumer } = UserContext;

export type UserProviderPropsType = {};

const UserProvider: React.FC<UserProviderPropsType> = ({ children }) => {
  const [, , user] = useApi((api) => api.apiUsersCurrentGet());
	return (
		<Provider value={{ user }}>
			{children}
		</Provider>
	);
};

export { UserProvider };
export { Consumer as UserConsumer };
export default UserContext;
