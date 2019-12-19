import React from 'react';
import ReactDOM from 'react-dom';
import 'react-dates/lib/css/_datepicker.css';
import './assets/styles/index.scss';
import App from './containers/App/App';
import { BrowserRouter } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import { AuthenticationProvider } from './contexts/Authentication/AuthenticationContext';
import { UserProvider } from './contexts/User/UserContext';
import { ReportingPeriodProvider } from './contexts/ReportingPeriod/ReportingPeriodContext';

const render = (Component: React.FC) => {
	return ReactDOM.render(
		<BrowserRouter>
			<AuthenticationProvider
				clientId="hedwig"
				localStorageKey="hedwig-key"
				// NOTE: "offline_access" is required in scope string to retrieve refresh tokens
				scope="openid profile hedwig_backend offline_access"
				extras={{
					// NOTE: Required for refresh tokens
					access_type: "offline"
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
