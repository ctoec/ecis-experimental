import React from 'react';
import useOASClient from '../../hooks/useOASClient';
import { User } from '../../OAS-generated/models/User';

export type UserContextType = {
  user?: User;
};

const UserContext = React.createContext<UserContextType>({
  user: undefined,
});

const { Provider, Consumer } = UserContext;

export type UserProviderPropsType = {
};

const UserProvider: React.FC<UserProviderPropsType> = ({
  children,
}) => {
  const { data: currentUser } = useOASClient('usersCurrentGet');
  return (
    <Provider
      value={{
        user: currentUser,
      }}
    >
      {children}
    </Provider>
	);
}

export { UserProvider };
export { Consumer as UserConsumer };
export default UserContext;