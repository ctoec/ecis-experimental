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
  QueryStringUtils
} from '@openid/appauth';
import { LoginConsumer, LoginProvider as InternalLoginProvider } from './LoginContext';

export type LoginProviderPropsType = {
  loginUriPrefix: string;
  openIdConnectUrl: string;
  clientId: string;
  redirectUrl: string;
  scope: string;
  responseType?: string,
  state?: any,
  extras?: any
}

const LoginProvider: React.FC<LoginProviderPropsType> = (
  {
    loginUriPrefix,
    openIdConnectUrl,
    clientId,
    redirectUrl,
    scope,
    responseType = AuthorizationRequest.RESPONSE_TYPE_CODE,
    state = undefined,
    extras = {'prompt': 'consent', 'access_type': 'offline'},
    children
  }
) => {
  // effects
  const history = useHistory();
  const location = useLocation();
  const [firstLoad, setFirstLoad] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [persistentConfiguration, setPersistentConfiguration] = useState<AuthorizationServiceConfiguration>();
  const [persistentTokenResponse, setPersistentTokenResponse] = useState<TokenResponse>();

  // state
  let configuration: AuthorizationServiceConfiguration | undefined;

  // auth flow 
  let notifier: AuthorizationNotifier;
  let authorizationHandler: AuthorizationRequestHandler;
  let tokenHandler: TokenRequestHandler;
  let checkForAuthorizationResponseInterval: NodeJS.Timeout;
  initAuthFlow();

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
        if(req && req.internal) verifier = req.internal.code_verifier;
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
   * Get service configuration from configured openId connect provider.
   * This function should only need to be called once for the lifetime of the app
   */
  async function fetchServiceConfiguration(): Promise<void> {
    if (persistentConfiguration) {
      return;
    }
    return AuthorizationServiceConfiguration.fetchFromIssuer(openIdConnectUrl, new FetchRequestor())
      .then(resp => {
        if(resp) {
        configuration = resp;
        setPersistentConfiguration(resp);
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  /**
   * Create and perform the initial authorization request.
   * Redirects user to IdentityServer to grant permission,
   * then returns to app to finish auth
   */
  function makeAuthorizationRequest() {
    // create a request
    let request = new AuthorizationRequest({
      client_id: clientId,
      redirect_uri: redirectUrl,
      scope: scope,
      response_type: responseType,
      state: state,
      extras: extras
    });

    if (configuration) {
      authorizationHandler.performAuthorizationRequest(configuration, request);
    }
  }

  /**
   * Create and perform authorization code-based token request.
   * This type of token request is only required after initial auth request.
   * Once a token is retrieve, the refresh token can be used to request subsquent
   * tokens (until the refresh token expires)
   */
  async function makeAuthorizationCodeTokenRequest(code: string, verifier: string | undefined) {
    if (!configuration) return;

    let extras:  StringMap | undefined = undefined;
    if(verifier) {
      extras = { 'code_verifier': verifier };
    }

    let req = new TokenRequest({
      client_id: clientId,
      redirect_uri: redirectUrl,
      grant_type: GRANT_TYPE_AUTHORIZATION_CODE,
      code: code,
      refresh_token: undefined,
      extras: extras
    });
    return tokenHandler.performTokenRequest(configuration, req)
      .then((resp) => {
        setAccessToken(resp.accessToken);
        setPersistentTokenResponse(resp);
        history.push('/');
      });
  }

  /**
   * Create and perform token refresh request.
   * Requires that initial code-based token request has already been performed.
   */
  async function makeRefreshTokenRequest() {
    if (!persistentConfiguration) return;
    if (!(persistentTokenResponse && persistentTokenResponse.refreshToken)) return;
    // isValid includes a defaut 10 min expiration buffer.
    if (persistentTokenResponse.isValid()) return;

    let req = new TokenRequest({
      client_id: clientId,
      redirect_uri: redirectUrl,
      grant_type: GRANT_TYPE_REFRESH_TOKEN,
      code: undefined,
      refresh_token: persistentTokenResponse.refreshToken,
    });
    tokenHandler.performTokenRequest(persistentConfiguration, req)
      .then((resp) => {
        setPersistentTokenResponse(resp);
        setAccessToken(resp.accessToken); 
      })
  }

  /**
   * Initiates login process from app
   */
  const beginLogin = function() {
    if (firstLoad) {
      setFirstLoad(false);
      fetchServiceConfiguration()
        .then(() => makeAuthorizationRequest());
      // the AppAuth library does not expose a promise for completion of the authorization request
      // so poll with second intervals to check for the response to complete request
      checkForAuthorizationResponseInterval = setInterval(authorizationHandler.completeAuthorizationRequestIfPossible, 1000);
    }
  }

  /**
   * Handles login completion upon redirect back to app from IdentityServer
   */
  const callbackLogin = function() {
    if (firstLoad) {
      setFirstLoad(false);
      clearInterval(checkForAuthorizationResponseInterval);
      fetchServiceConfiguration()
        .then(() => authorizationHandler.completeAuthorizationRequestIfPossible())
    }
  }

  /**
   * Triggers login actions based on location
   */
  useEffect(() => {
    // only process requests that have the loginUriPrefix
    if (location.pathname === loginUriPrefix) {
      beginLogin();
    } else if (location.pathname === `${loginUriPrefix}/callback`) {
      callbackLogin();
    }
  });

  /**
   * The wrapped LoginContext provider with instantiated values
   */
  return (
    <InternalLoginProvider value={{
      accessToken: accessToken,
      withFreshToken: makeRefreshTokenRequest
    }}>
      {children}
    </InternalLoginProvider>
  );
}

export type WithLoginPropsType = {
  accessToken: string,
  withFreshToken: () => {}
}

/**
 *  Wrapper function to turn arbitrary component into login consumer
 * @param Component 
 */
const withLogin = <P extends WithLoginPropsType>(Component: React.FC<P>): React.FC<Subtract<P, WithLoginPropsType>> => 
  (props) => 
      <LoginConsumer>
        {({accessToken}) =>
          <Component {...props as P} accessToken={accessToken}/>
        }
      </LoginConsumer>

export default withLogin;

export { LoginProvider };