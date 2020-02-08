import React from 'react';
import { render, cleanup, fireEvent, waitForElement, getAllByRole } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

export function accessibilityTestHelper(testComponent: React.ReactElement) {
	it('passes accessibility checks', async () => {
		const { container } = render(testComponent);
    const results = await axe(container);
    console.log(container, results)

		expect(results).toHaveNoViolations();

		cleanup();
	});
}
