import React from 'react';

export type LoginContextType = {
  accessToken: string | null,
  withFreshToken: () => (Promise<void>),
}

const LoginContext = React.createContext<LoginContextType>({
  accessToken: null,
  withFreshToken: async () => {}
});

const { Provider, Consumer } = LoginContext;

export { Provider as LoginProvider };
export { Consumer as LoginConsumer };
export default LoginContext;