import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import {
	AuthorizationNotifier,
	AuthorizationRequestHandler,
	TokenRequestHandler,
	AuthorizationServiceConfiguration,
	AuthorizationRequest,
	TokenResponse,
	RedirectRequestHandler,
	BaseTokenRequestHandler,
	TokenRequest,
	StringMap,
	GRANT_TYPE_AUTHORIZATION_CODE,
	GRANT_TYPE_REFRESH_TOKEN,
	FetchRequestor,
	BasicQueryStringUtils,
	LocationLike,
	QueryStringUtils,
} from '@openid/appauth';
import { getConfig } from '../../config';
import getCurrentHost from '../../utils/getCurrentHost';

export type AuthenticationContextType = {
	accessToken: string | null;
	withFreshToken: () => Promise<void>;
};

export type AuthenticationProviderPropsType = {
	clientId: string;
	scope: string;
	localStorageKey: string;
	loginEndpoint?: string;
	defaultOpenIdConnectUrl?: string;
	redirectEndpoint?: string;
	logoutEndpoint?: string,
	responseType?: string;
	state?: any;
	extras?: any;
};

const AuthenticationContext = React.createContext<AuthenticationContextType>({
	accessToken: null,
	withFreshToken: async () => {},
});

const { Provider, Consumer } = AuthenticationContext;

/**
 * Context Provider for OpenID Connect Login
 * 
 * @param props The props for configuring authentication.
 */
const AuthenticationProvider: React.FC<AuthenticationProviderPropsType> = ({
	loginEndpoint = '/login',
	defaultOpenIdConnectUrl = null,
	clientId,
	redirectEndpoint = '/login/callback',
	logoutEndpoint = '/logout',
	scope,
	localStorageKey,
	responseType = AuthorizationRequest.RESPONSE_TYPE_CODE,
	state = undefined,
	extras = {},
	children,
}) => {
	// effects
	const history = useHistory();
	const location = useLocation();

	// state
	const [idToken, setIdToken] = useState<string>();
	const [accessToken, setAccessToken] = useState<string | null>(null);
	const [openIdConnectUrl, setOpenIdConnectUrl] = useState();

	// auth flow state
	const [notifier] = useState<AuthorizationNotifier>(
		new AuthorizationNotifier()
	);
	notifier.setAuthorizationListener((req, resp, _) => {
		if (resp) {
			let verifier: string | undefined;
			if (req && req.internal) verifier = req.internal.code_verifier;
			makeAuthorizationCodeTokenRequest(resp.code, verifier);
		}
	});
	const [authorizationHandler] = useState<AuthorizationRequestHandler>(
		new RedirectRequestHandler(
			// Use the default storage backend (i.e. local storage)
			undefined,
			// Identity Server is returning the authorization_code in the query string
			// not URL hash. AppAuth hardcodes the use of hash in other logic.
			// However, it does expose the ability to use query strings with the default
			// BasicQueryStringUtils. By overriding the parse method, we can always
			// require query string parsing irrespective of the supplied argument.
			new (class extends BasicQueryStringUtils implements QueryStringUtils {
				parse(input: LocationLike, _?: boolean): StringMap {
					return super.parse(input, false);
				}
			})()
		)
	);
	authorizationHandler.setAuthorizationNotifier(notifier);
	const [tokenHandler] = useState<TokenRequestHandler>(
		new BaseTokenRequestHandler(new FetchRequestor())
	);
	const [configuration, setConfiguration] = useState<AuthorizationServiceConfiguration>();
	const [tokenResponse, setTokenResponse] = useState<TokenResponse>();

	// endpoint variables
	const isLogin = location.pathname === loginEndpoint;
	const isCallback = location.pathname === redirectEndpoint;
	const isLogout = location.pathname === logoutEndpoint;
	const redirectUrl = `${getCurrentHost()}${redirectEndpoint}`;

	// Setup open id connect url on initial mount
	useEffect(() => {
		(async () => {
			if (!!defaultOpenIdConnectUrl) {
				setOpenIdConnectUrl(defaultOpenIdConnectUrl);
			} else if (!openIdConnectUrl) {
				const wingedKeysUri = await getConfig('WingedKeysUri');
				setOpenIdConnectUrl(wingedKeysUri);
			}
		})();
	}, [defaultOpenIdConnectUrl, openIdConnectUrl]);

	// Get accessToken from localstorage on initial mount
	useEffect(() => {
		const localStorageAccessToken = localStorage.getItem(localStorageKey);
		// Update accessToken if it was present in local storage
		if (!!localStorageAccessToken) {
			setAccessToken(localStorageAccessToken);
		}
	}, [localStorageKey]);

	// Update localstorage when accessToken changes
	useEffect(() => {
		const localStorageAccessToken = localStorage.getItem(localStorageKey);
		if (accessToken && accessToken !== localStorageAccessToken) {
			localStorage.setItem(localStorageKey, accessToken);
		}
	}, [accessToken, localStorageKey]);

	// Only fetch on openIdConnectUrl change
	useEffect(() => {
		/**
		 * Get service configuration from configured openId connect provider.
		 * This function should only need to be called once for the lifetime of the app
		 */
		async function fetchServiceConfiguration(): Promise<void> {
			if (!openIdConnectUrl) {
				return;
			}
			const configuration = await AuthorizationServiceConfiguration.fetchFromIssuer(
				openIdConnectUrl,
				new FetchRequestor()
			);
			setConfiguration(configuration);
		}
		fetchServiceConfiguration();
	}, [openIdConnectUrl]);

	// Make an authorization request whenever:
	// 1) the authorizationHandler is set,
	// 2) the configuration is set or changes, and
	// 3) it is the login screen (isLogin or isCallback)
	useEffect(() => {
		if (configuration && authorizationHandler) {
			if (isLogin) {
				/*
				 * Create and perform the initial authorization request,
				 * including IdentityServer permission acquisition.
				 */
				let request = new AuthorizationRequest({
					client_id: clientId,
					redirect_uri: redirectUrl,
					scope: scope,
					response_type: responseType,
					state: state,
					extras: extras,
				});
				authorizationHandler.performAuthorizationRequest(configuration, request);
			} else if (isCallback) {
				/*
				 * Completes authorization request if possible, executing the callback
				 * defined in setAuthorizationListener(). Here, this includes making the
				 * initial code-based token request.
				 */
				authorizationHandler.completeAuthorizationRequestIfPossible();
			} else if (isLogout) {
				/*
				 * Remove the access token, clear react state, and navigate to main page.
				 */
				localStorage.removeItem(localStorageKey);
				setAccessToken(null);
				if (!configuration.endSessionEndpoint) {
					throw new Error("no logout");
				}
				const endSessionQueryParams = {
					id_token_hint: idToken,
					post_logout_redirect_uri: getCurrentHost()
				} as StringMap;
				const logoutUrl = `${configuration.endSessionEndpoint}?${(new BasicQueryStringUtils()).stringify(endSessionQueryParams)}`;
				window.location.href = logoutUrl;
			}
		}
	}, [
		idToken,
		clientId,
		scope,
		localStorageKey,
		configuration,
		authorizationHandler,
		responseType,
		state,
		extras,
		history,
		isLogin,
		isCallback,
		isLogout,
		redirectUrl
	]);

	/**
	 * Create and perform authorization code-based token request.
	 * This type of token request is only executed after the initial auth request,
	 * and is invoked as the authorization listener callback.
	 * Once a token is retrieved, the refresh token can be used to request subsquent
	 * tokens (until the refresh token expires)
	 */
	async function makeAuthorizationCodeTokenRequest(code: string, verifier: string | undefined) {
		if (!configuration) return;

		let extras: StringMap | undefined = undefined;
		if (verifier) {
			extras = { code_verifier: verifier };
		}

		let req = new TokenRequest({
			client_id: clientId,
			redirect_uri: redirectUrl,
			grant_type: GRANT_TYPE_AUTHORIZATION_CODE,
			code: code,
			refresh_token: undefined,
			extras: extras,
		});
		return tokenHandler.performTokenRequest(configuration, req).then(resp => {
			setIdToken(resp.idToken);
			setAccessToken(resp.accessToken);
			setTokenResponse(resp);
			history.push('/');
		});
	}

	/**
	 * Create and perform token refresh request.
	 * Requires that initial code-based token request has already been performed.
	 */
	async function makeRefreshTokenRequest() {
		if (!configuration) return;
		if (!(tokenResponse && tokenResponse.refreshToken)) return;
		// isValid includes a defaut 10 min expiration buffer.
		if (tokenResponse.isValid()) return;

		let req = new TokenRequest({
			client_id: clientId,
			redirect_uri: redirectUrl,
			grant_type: GRANT_TYPE_REFRESH_TOKEN,
			code: undefined,
			refresh_token: tokenResponse.refreshToken,
		});
		tokenHandler.performTokenRequest(configuration, req).then(resp => {
			setTokenResponse(resp);
			setAccessToken(resp.accessToken);
		});
	}

	/**
	 * The wrapped AuthenticationContext provider with instantiated values
	 */
	return (
		<Provider
			value={{
				accessToken: accessToken,
				withFreshToken: makeRefreshTokenRequest,
			}}
		>
			{children}
		</Provider>
	);
};

export { AuthenticationProvider };
export { Consumer as LoginConsumer };
export default AuthenticationContext;
