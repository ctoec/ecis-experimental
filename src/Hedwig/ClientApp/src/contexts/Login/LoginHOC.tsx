import React, { useEffect, useState } from 'react';
import { Subtract } from 'utility-types';
import { useHistory, useLocation } from 'react-router-dom';
import {
  AuthorizationNotifier,
  AuthorizationRequestHandler,
  TokenRequestHandler,
  AuthorizationServiceConfiguration,
  AuthorizationRequest,
  AuthorizationResponse,
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

  // state
  let configuration: AuthorizationServiceConfiguration | undefined;
  let request: AuthorizationRequest | undefined;
  let response: AuthorizationResponse | undefined;
  let code: string | undefined;
  let tokenResponse: TokenResponse | undefined;

  // auth flow declaration
  let notifier: AuthorizationNotifier;
  let authorizationHandler: AuthorizationRequestHandler;
  let tokenHandler: TokenRequestHandler;

  // auth flow
  notifier = new AuthorizationNotifier();
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
  tokenHandler = new BaseTokenRequestHandler(new FetchRequestor());
  // set notifier to deliver responses
  authorizationHandler.setAuthorizationNotifier(notifier);
  // set a listener to listen for authorization responses
  notifier.setAuthorizationListener((req, resp, error) => {
    if (resp) {
      request = req;
      response = resp;
      code = resp.code;
    }
  });

  // clean up
  let checkForAuthorizationResponseInterval: NodeJS.Timeout;

  function fetchServiceConfiguration(): Promise<void> {
    if (configuration) {
      return Promise.resolve();
    }
    return AuthorizationServiceConfiguration.fetchFromIssuer(openIdConnectUrl, new FetchRequestor())
      .then(resp => {
        configuration = resp;
      })
      .catch(error => {
        console.error(error);
      });
  }

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

  function makeTokenRequest() {
    if (!configuration) {
      return;
    }

    let req: TokenRequest | null = null;
    if (code) {
      let extras: StringMap | undefined = undefined;
      if (request && request.internal) {
        extras = {};
        extras['code_verifier'] = request.internal['code_verifier'];
      }
      // use the code to make the token request.
      req = new TokenRequest({
        client_id: clientId,
        redirect_uri: redirectUrl,
        grant_type: GRANT_TYPE_AUTHORIZATION_CODE,
        code: code,
        refresh_token: undefined,
        extras: extras
      });
    } else if (tokenResponse) {
      // use the token response to make a request for an access token
      req = new TokenRequest({
        client_id: clientId,
        redirect_uri: redirectUrl,
        grant_type: GRANT_TYPE_REFRESH_TOKEN,
        code: undefined,
        refresh_token: tokenResponse.refreshToken,
        extras: undefined
      });
    }

    if (req) {
      tokenHandler.performTokenRequest(configuration, req)
        .then(resp => {
          let isFirstRequest = false;
          if (tokenResponse) {
            // copy over new fields
            tokenResponse.accessToken = resp.accessToken;
            tokenResponse.issuedAt = resp.issuedAt;
            tokenResponse.expiresIn = resp.expiresIn;
            tokenResponse.tokenType = resp.tokenType;
            tokenResponse.scope = resp.scope;
          } else {
            isFirstRequest = true;
            tokenResponse = resp;
          }

          // unset code, so we can do refresh token exchanges subsequently
          code = undefined;
          if (isFirstRequest) {
            console.log(resp);
            setAccessToken(resp.accessToken);
          } else {
            // refresh token section
          }
          history.push('/');
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  function checkForAuthorizationResponse() {
    authorizationHandler.completeAuthorizationRequestIfPossible();
  }

  const beginLogin = function() {
    if (firstLoad) {
      setFirstLoad(false);
      fetchServiceConfiguration()
        .then(() => makeAuthorizationRequest());
      // the AppAuth library does not expose a promise for completion of the authorization request
      // so poll with second intervals to check for the response to complete request
      checkForAuthorizationResponseInterval = setInterval(checkForAuthorizationResponse, 1000);
    }
  }

  const callbackLogin = function() {
    if (firstLoad) {
      setFirstLoad(false);
      clearInterval(checkForAuthorizationResponseInterval);
      fetchServiceConfiguration()
        .then(() => authorizationHandler.completeAuthorizationRequestIfPossible())
        .then(() => makeTokenRequest());
    }
  }

  useEffect(() => {
    // only process requests that have the loginUriPrefix
    if (location.pathname === loginUriPrefix) {
      beginLogin();
    } else if (location.pathname === `${loginUriPrefix}/callback`) {
      callbackLogin();
    }
  });

  return (
    <InternalLoginProvider value={{
      accessToken: accessToken,
      setAccessToken: setAccessToken
    }}>
      {children}
    </InternalLoginProvider>
  );
}

export type WithLoginPropsType = {
  accessToken: string
}

const withLogin = <P extends WithLoginPropsType>(Component: React.FC<P>): React.FC<Subtract<P, WithLoginPropsType>> => 
  (props) => 
      <LoginConsumer>
        {({accessToken}) =>
          <Component {...props as P} accessToken={accessToken} />
        }
      </LoginConsumer>

export default withLogin;

export { LoginProvider };