// Variables used in jest mocks -- must start with `mock`
import {
	mockReport,
	mockEnrollmentMissingBirthCertId, // full time preschool
	mockEnrollmentMissingAddress, // full time preschool,
} from '../../tests/data';
import mockUseApi, {
	mockApiOrganizationsOrgIdReportsIdGet,
} from '../../hooks/useApi/__mocks__/useApi';

let mockEnrollments = [mockEnrollmentMissingBirthCertId, mockEnrollmentMissingAddress];
// Jest mocks must occur before later imports
jest.mock('../../hooks/useApi', () => ({
	// When trying to mock both a default import and named import,
	// we must specify __esModule: true on the returned object.
	__esModule: true,
	default: mockUseApi({
		apiOrganizationsOrgIdReportsIdGet: (_: any) =>
			mockApiOrganizationsOrgIdReportsIdGet({ ...mockReport, enrollments: mockEnrollments })(_),
	}),
	paginate: (_: any, __: any) => _,
}));

let mockSiteId: number | undefined = 1;
jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
	useParams: () => ({
		id: mockSiteId,
	}),
}));

import React from 'react';
import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';

import 'react-dates/initialize';

import { accessibilityTestHelper } from '../../tests/helpers';
import TestProvider from '../../contexts/__mocks__/TestProvider';

import BatchEdit from './BatchEdit';

const batchEditProps = {
	history: createMemoryHistory(),
	location: { search: 'TODO CHANGE THIS' },
};

describe('Batch edit', () => {
	it('matches snapshot', () => {
		const { asFragment } = render(
			<TestProvider>
				<BatchEdit {...batchEditProps} />
			</TestProvider>
		);
		expect(asFragment()).toMatchSnapshot();
	});

	accessibilityTestHelper(
		<TestProvider>
			<BatchEdit {...batchEditProps} />
		</TestProvider>
	);
});
