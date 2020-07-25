// Variables used in jest mocks -- must start with `mock`
import {
	mockReport,
	mockEnrollmentMissingBirthCertId, // full time preschool
	mockEnrollmentMissingAddress, // full time preschool,
} from '../../tests/data';

// Must rename HedwigApi to MockHedwigApi to get around:
// 		The module factory of `jest.mock()` is not allowed 
// 		to reference any out-of-scope variables.
// 		Note: This is a precaution to guard against uninitialized
// 		mock variables. If it is ensured that the mock is
// 		required lazily, variable names prefixed with `mock` 
// 		(case insensitive) are permitted.
import { HedwigApi as MockHedwigApi, CdcReport } from '../../generated';

let mockEnrollments = [mockEnrollmentMissingBirthCertId, mockEnrollmentMissingAddress];
jest.mock('../../hooks/useApi/api', () => ({
	constructApi: (_: any) => new (class extends MockHedwigApi {
		apiOrganizationsOrgIdReportsIdGet() {
			return new Promise<CdcReport>((resolve) => 
				resolve({
					...mockReport,
					enrollments: mockEnrollments
				})	
			)
		}
	})()	
}));

let mockSiteId: number | undefined = 1;
jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
	useParams: () => ({
		id: mockSiteId,
	}),
}));

import React from 'react';
import { render, waitForElementToBeRemoved, cleanup } from '@testing-library/react';

import 'react-dates/initialize';

import TestProvider from '../../contexts/__mocks__/TestProvider';

import BatchEdit from './BatchEdit';
import { axe } from 'jest-axe';

const batchEditProps = {
	location: { search: `?reportId=${mockReport.id}` },
};

describe('BatchEdit', () => {
	it('matches snapshot', async () => {
		const { asFragment, queryAllByText } = render(
			<TestProvider>
				<BatchEdit {...batchEditProps} />
			</TestProvider>
		);

		await waitForElementToBeRemoved(() => queryAllByText(/Loading/));
		expect(asFragment()).toMatchSnapshot();
	});

	// Cannot use AccessibilityTestHelper, as we need to enforce
	// custom wait logic, which requires access to the results 
	// of `render()`
	it('passes accessibility checks', async() => {
		const { container, queryAllByText } = render(
			<TestProvider>
				<BatchEdit {...batchEditProps} />
			</TestProvider>
		);

		await waitForElementToBeRemoved(() => queryAllByText(/Loading/));
		const results = await axe(container);
		expect(results).toHaveNoViolations();
	})

	afterEach(() => {
		cleanup();
	});
});
