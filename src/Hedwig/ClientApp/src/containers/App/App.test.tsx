import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import App from './App';

it('renders without crashing', () => {
	const div = document.createElement('div');
	ReactDOM.render(
		<BrowserRouter>
			<App />
		</BrowserRouter>,
		div
	);
	ReactDOM.unmountComponentAtNode(div);
});

it('matches snapshot', () => {
	const { asFragment } = render(
		<MemoryRouter>
			<App />
		</MemoryRouter>
	);

	expect(asFragment()).toMatchSnapshot();
});
