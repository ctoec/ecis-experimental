import React from 'react';

export type LoginContextType = {
  accessToken: string | null,
  setAccessToken: (_: string) => void
}

const LoginContext = React.createContext<LoginContextType>({
  accessToken: null,
  setAccessToken: () => {}
});
const { Provider, Consumer } = LoginContext;

export { Provider as LoginProvider };
export { Consumer as LoginConsumer };
export default LoginContext;