import React from 'react';
import { Card } from './Card';
import { render } from '@testing-library/react';

it('matches snapshot', () => {
	const component = render(<Card>Hi there</Card>);
	expect(component).toMatchSnapshot();
});
