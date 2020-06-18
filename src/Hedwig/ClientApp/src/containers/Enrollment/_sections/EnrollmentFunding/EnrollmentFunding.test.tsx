jest.mock('../../../../hooks/useApi/error', () => ({
	parseError: (_: any) => _,
}));

jest.mock('../../../../hooks/useApi/api');

import * as useApiApi from '../../../../hooks/useApi/api';

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { HedwigApi, Enrollment, Organization } from '../../../../generated';
import EnrollmentFunding from '.';
import TestProvider from '../../../../contexts/__mocks__/TestProvider';
import { REQUIRED_FOR_ENROLLMENT } from '../../../../utils/validations/messageStrings';
import { mockCompleteEnrollment, mockSingleSiteOrganization } from '../../../../tests/data';
import { act } from 'react-dom/test-utils';

describe('enrollment sections', () => {
	describe('EnrollmentFunding', () => {
		describe('NewForm', () => {
			describe('shows blocking errors', () => {
				beforeAll(() => {
					const mockedUseApiApi = useApiApi as jest.Mocked<typeof useApiApi>;
					mockedUseApiApi.constructApi.mockReturnValue(
						new (class extends HedwigApi {
							apiOrganizationsOrgIdSitesSiteIdEnrollmentsPost() {
								console.log('ERROR RESP');
								return new Promise<Enrollment>((_, reject) =>
									reject({
										errors: {
											'Fundings[0].FirstReportingPeriodId': ['error'],
											'Fundings[0].FundingSpaceId': ['error'],
										},
										status: 400,
									})
								);
							}

							apiOrganizationsIdGet() {
								return new Promise<Organization>((resolve) => resolve(mockSingleSiteOrganization));
							}
						})()
					);
				});

				it('if FirstReportingPeriodId error', async () => {
					// const { findByText } = render(
					// 	<TestProvider>
					// 		<EnrollmentFunding.Form
					// 			siteId={1}
					// 			enrollment={mockCompleteEnrollment}
					// 			updateEnrollment={jest.fn()}
					// 			error={null}
					// 		/>
					// 	</TestProvider>
					// );
					// const saveBtn = await findByText('Save');
					// fireEvent.click(saveBtn);
					// const firstReportingPeriodInput = (await findByText('First reporting period')).closest('div');
					// expect(firstReportingPeriodInput).toHaveTextContent(REQUIRED_FOR_ENROLLMENT);
				});
			});
		});
	});
});
