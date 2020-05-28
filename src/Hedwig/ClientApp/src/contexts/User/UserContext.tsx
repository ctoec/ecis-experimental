import React from 'react';
import useApi from '../../hooks/useApi';
import { User } from '../../generated/models/User';

export type UserContextType = {
	user?: User;
	loading: boolean;
};

const UserContext = React.createContext<UserContextType>({
	user: undefined,
	loading: true,
});

const { Provider, Consumer } = UserContext;

export type UserProviderPropsType = {};

/**
 * Context Provider for injecting User object into React hierarchy
 *
 * @param props Props with user
 */
const UserProvider: React.FC<UserProviderPropsType> = ({ children }) => {
	const { loading, data: user } = useApi((api) => api.apiUsersCurrentGet());
	return <Provider value={{ loading, user }}>{children}</Provider>;
};

export { UserProvider };
export { Consumer as UserConsumer };
export default UserContext;
