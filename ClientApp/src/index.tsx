import React from 'react';
import ReactDOM from 'react-dom';
import './assets/styles/index.scss';
import App from './containers/App/App';
import { BrowserRouter } from 'react-router-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import * as serviceWorker from './serviceWorker';
import { PrintModeProvider } from './contexts/PrintMode/PrintModeHOC';

const apollo = new ApolloClient({ uri: '/graphql' });

const render = (Component: React.FC<{}>) => {
	return ReactDOM.render(
		<ApolloProvider client={apollo}>
			<PrintModeProvider value={false}>
				<BrowserRouter>
					<Component />
				</BrowserRouter>
			</PrintModeProvider>
		</ApolloProvider>,
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
