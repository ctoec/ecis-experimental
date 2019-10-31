import React from 'react';
import ReactDOM from 'react-dom';
import './assets/styles/index.scss';
import App from './containers/App/App';
import { BrowserRouter } from 'react-router-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import * as serviceWorker from './serviceWorker';
import { LoginProvider } from './contexts/Login';

const apollo = new ApolloClient({ uri: '/graphql' });

const render = (Component: React.FC) => {
	return ReactDOM.render(
		<BrowserRouter>
			<LoginProvider
				loginUriPrefix="/login"
				openIdConnectUrl="https://localhost:5050"
				clientId="hedwig"
				redirectUrl="https://localhost:5001/login/callback"
				// NOTE: "offline_access" is required in scope string to retrieve refresh tokens
				scope="openid profile hedwig_backend offline_access"
			>
				<ApolloProvider client={apollo}>
					<Component />
				</ApolloProvider>
			</LoginProvider>
		</BrowserRouter>,
		document.getElementById('root')
	);
};

render(App);

if (module.hot) {
	module.hot.accept('./containers/App/App', () => {
		const NextApp = require('./containers/App/App').default;
		render(NextApp);
	});
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
