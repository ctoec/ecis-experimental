import React from 'react';
import useApi from '../../hooks/useApi';
import { User } from '../../generated/models/User';

export type UserContextType = {
	user?: User;
};

const UserContext = React.createContext<UserContextType>({
	user: undefined,
});

const { Provider, Consumer } = UserContext;

export type UserProviderPropsType = {};

/**
 * Context Provider for injecting User object into React hierarchy
 *
 * @param props Props with user
 */
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