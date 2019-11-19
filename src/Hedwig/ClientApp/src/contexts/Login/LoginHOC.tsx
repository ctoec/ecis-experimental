import React, { useEffect, useState } from 'react';
import { Subtract } from 'utility-types';
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
import { LoginConsumer, LoginProvider as InternalLoginProvider } from './LoginContext';
import { getConfig } from '../../config';
import getCurrentHost from '../../utils/getCurrentHost';

export type LoginProviderPropsType = {
	loginEndpoint: string;
	defaultOpenIdConnectUrl?: string;
	clientId: string;
	redirectEndpoint: string;
	scope: string;
	responseType?: string;
	state?: any;
	extras?: any;
};

const LoginProvider: React.FC<LoginProviderPropsType> = ({
	loginEndpoint,
	defaultOpenIdConnectUrl = null,
	clientId,
	redirectEndpoint,
	scope,
	responseType = AuthorizationRequest.RESPONSE_TYPE_CODE,
	state = undefined,
	extras = { prompt: 'consent', access_type: 'offline' },
	children,
}) => {
	// effects
	const history = useHistory();
	const location = useLocation();
	const [accessToken, setAccessToken] = useState<string | null>(null);
	const [configuration, setConfiguration] = useState<
		AuthorizationServiceConfiguration | undefined
	>();
	const [tokenResponse, setTokenResponse] = useState<TokenResponse>();
	const [openIdConnectUrl, setOpenIdConnectUrl] = useState();
	const redirectUrl = `${getCurrentHost()}${redirectEndpoint}`;

	// state
	const isLogin = location.pathname === loginEndpoint;
	const isCallback = location.pathname === redirectEndpoint;

	// auth flow
	let notifier: AuthorizationNotifier;
	let authorizationHandler: AuthorizationRequestHandler | undefined = undefined;
	let tokenHandler: TokenRequestHandler;
	initAuthFlow();

	// Setup open id connect url
	useEffect(() => {
		(async () => {
			if (defaultOpenIdConnectUrl != null) {
				setOpenIdConnectUrl(defaultOpenIdConnectUrl);
			} else {
				const wingedKeysUri = await getConfig('WingedKeysUri');
				setOpenIdConnectUrl(wingedKeysUri);
			}
		})();
	});

	// Only fetch on inital mount
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
				/**
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
				/**
				 * Completes authorization request if possible, executing the callback
				 * defined in setAuthorizationListener(). Here, this includes making the
				 * initial code-based token request.
				 */
				authorizationHandler.completeAuthorizationRequestIfPossible();
			}
		}
	}, [
		configuration,
		isLogin,
		isCallback,
		authorizationHandler,
		clientId,
		redirectUrl,
		scope,
		responseType,
		state,
		extras,
	]);

	/**
	 *  Instantiates openId/appauth flow control components
	 */
	function initAuthFlow() {
		tokenHandler = new BaseTokenRequestHandler(new FetchRequestor());

		// set notifier to deliver authorization responses
		notifier = new AuthorizationNotifier();
		// set a listener to listen for and handle authorization responses
		notifier.setAuthorizationListener((req, resp, error) => {
			if (resp) {
				let verifier: string | undefined;
				if (req && req.internal) verifier = req.internal.code_verifier;
				makeAuthorizationCodeTokenRequest(resp.code, verifier);
			}
		});
		authorizationHandler = new RedirectRequestHandler(
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
		);
		authorizationHandler.setAuthorizationNotifier(notifier);
	}

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
	 * The wrapped LoginContext provider with instantiated values
	 */
	return (
		<InternalLoginProvider
			value={{
				accessToken: accessToken,
				withFreshToken: makeRefreshTokenRequest,
			}}
		>
			{children}
		</InternalLoginProvider>
	);
};

export type WithLoginPropsType = {
	accessToken: string;
	withFreshToken: () => {};
};

/**
 *  Wrapper function to turn arbitrary component into login consumer
 * @param Component
 */
const withLogin = <P extends WithLoginPropsType>(
	Component: React.FC<P>
): React.FC<Subtract<P, WithLoginPropsType>> => props => (
	<LoginConsumer>
		{({ accessToken }) => <Component {...(props as P)} accessToken={accessToken} />}
	</LoginConsumer>
);

export default withLogin;

export { LoginProvider };
