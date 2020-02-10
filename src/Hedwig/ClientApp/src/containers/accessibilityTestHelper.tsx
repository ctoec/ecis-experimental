import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';


expect.extend(toHaveNoViolations);

// This is a *very* minimal accessibility check
// From the README for the jest-axe library: "The GDS Accessibility team found that only ~30% of issues are found by automated testing."
export function accessibilityTestHelper(testComponent: React.ReactElement) {
	it('passes accessibility checks', async () => {
		const { container } = render(testComponent);
		const results = await axe(container);
		expect(results).toHaveNoViolations();
		cleanup();
	});
}
