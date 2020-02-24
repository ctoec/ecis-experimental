import React from 'react';
import PrivacyPolicy from './PrivacyPolicy';
import { render } from '@testing-library/react';

describe('PrivacyPolicy', () => {
	it('matches snapshot', () => {
		const { asFragment } = render(<PrivacyPolicy />);
		expect(asFragment()).toMatchSnapshot();
	});
});
