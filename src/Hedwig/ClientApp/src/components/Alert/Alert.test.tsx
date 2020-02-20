import React from 'react';
import { render } from '@testing-library/react';
import { Alert } from './Alert';

it('matches snapshot', () => {
	const component = render(<Alert text="I'm an alert" type="error" />);

	expect(component).toMatchSnapshot();
});
