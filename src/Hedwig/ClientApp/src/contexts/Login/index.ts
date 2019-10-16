import * as LoginHOC from './LoginHOC';

export type LoginProviderPropsType = LoginHOC.LoginProviderPropsType;
export type WithLoginPropsType = LoginHOC.WithLoginPropsType;

const LoginProvider = LoginHOC.LoginProvider;

export default LoginHOC.default;
export { LoginProvider };