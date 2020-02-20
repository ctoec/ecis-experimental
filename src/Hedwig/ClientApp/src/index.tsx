import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { AuthenticationProvider } from './contexts/Authentication/AuthenticationContext';
import { UserProvider } from './contexts/User/UserContext';
import { ReportingPeriodProvider } from './contexts/ReportingPeriod/ReportingPeriodContext';

import * as serviceWorker from './serviceWorker';

import App from './containers/App/App';

import 'react-dates/lib/css/_datepicker.css';
import './assets/styles/index.scss';

if (process.env.NODE_ENV !== 'production') {
	const axe = require('react-axe');
	axe(React, ReactDOM, 1000);
}

const render = (Component: React.FC) => {
	return ReactDOM.render(
		<BrowserRouter>
			<AuthenticationProvider
				clientId="hedwig"
				localStorageKey="hedwig-key"
				defaultOpenIdConnectUrl={
					process.env.REACT_APP_SELENIUM_TESTS ? 'https://winged-keys:5050' : undefined
				}
				// NOTE: "offline_access" is required in scope string to retrieve refresh tokens
				scope="openid profile hedwig_backend offline_access"
				extras={{
					// NOTE: Required for refresh tokens
					access_type: 'offline',
				}}
			>
				<UserProvider>
					<ReportingPeriodProvider>
						<Component />
					</ReportingPeriodProvider>
				</UserProvider>
			</AuthenticationProvider>
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
