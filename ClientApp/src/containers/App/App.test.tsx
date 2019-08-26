import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import App from './App';

it('renders without crashing', () => {
	const div = document.createElement('div');
	ReactDOM.render(
	  <MockedProvider>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</MockedProvider>,
		div
	);
	ReactDOM.unmountComponentAtNode(div);
});
