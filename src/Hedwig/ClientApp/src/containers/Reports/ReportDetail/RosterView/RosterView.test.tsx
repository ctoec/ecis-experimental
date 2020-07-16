// Variables used in jest mockes -- must start with `mock`
import {
	mockDefaultReport,
	mockReport as _mockReport,
	mockCompleteEnrollment,
	mockEnrollmentWithFoster,
	mockSingleSiteOrganization,
} from '../../../../tests/data';
import mockUseApi, {
	mockApiOrganizationsOrgIdEnrollmentsGet,
	mockApiOrganizationsIdGet,
} from '../../../../hooks/useApi/__mocks__/useApi';

// Jest mocks must occur before later imports
jest.mock('../../../../hooks/useApi', () => ({
	// When trying to mock both a default import and named import,
	// we must specify __esModule: true on the returned object.
	__esModule: true,
	default: mockUseApi({
		apiOrganizationsOrgIdEnrollmentsGet: mockApiOrganizationsOrgIdEnrollmentsGet([
			mockCompleteEnrollment,
			mockEnrollmentWithFoster,
		]),
		apiOrganizationsIdGet: mockApiOrganizationsIdGet(mockSingleSiteOrganization),
	}),
	paginate: (_: any, __: any) => _,
}));

import React from 'react';
import { render } from '@testing-library/react';
import TestProvider from '../../../../contexts/__mocks__/TestProvider';
import { CdcReport, Organization } from '../../../../generated';
import { Form } from '../../../../components/Form_New';
import RosterView from '../../../../containers/Reports/ReportDetail/RosterView/RosterView';

describe('RosterView', () => {
	it('matches snapshot', () => {
		const { asFragment } = render(
			<TestProvider>
				<Form<CdcReport> data={mockDefaultReport} onSubmit={jest.fn()} className="">
					<RosterView 
						rosterEnrollments={mockDefaultReport.enrollments || []}
						organization={mockDefaultReport.organization as Organization}
						reportingPeriod={mockDefaultReport.reportingPeriod}
					/>
				</Form>
			</TestProvider>
		);
		expect(asFragment()).toMatchSnapshot();
	});
});
