// Note: Readers are instructued to go to this file in the mock useApi.ts file
// for example on how to mock constructApi and parseError. If you change the
// logic in this file, please update that comment accordingly.

// Tell jest we are planning on mocking these modules
// Mock parseError to become the identity function.
// We are going to provide the actual error in the API mock.
jest.mock('../../../../hooks/useApi/error', () => ({
	parseError: (_: any) => _,
}));
// Don't provide a factory because we are going to supply a mock for each test as
// needed.
jest.mock('../../../../hooks/useApi/api');

// We must import with the wildcard selector so we can access the specific
// property values for jest's mocking. That is, jest requires we do
// useApiApi.constructApi.mock instead of importing constructApi directly
// and doing constructApi.mock.
import * as useApiApi from '../../../../hooks/useApi/api';

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ChildInfo from '../ChildInfo';
import { DeepNonUndefineable } from '../../../../utils/types';
import { Enrollment, HedwigApi } from '../../../../generated';
import { mockCompleteEnrollment } from '../../../../tests/data';
import { getValidationError } from '../../../../tests/helpers';
import {
	REQUIRED_FOR_OEC_REPORTING,
	REQUIRED_FOR_ENROLLMENT,
} from '../../../../utils/validations/messageStrings';
import TestProvider from '../../../../contexts/__mocks__/TestProvider';

describe('enrollment sections', () => {
	describe('ChildInfo', () => {
		// Tests for whether blocking errors appear on the page
		describe('shows blocking errors', () => {
			beforeAll(() => {
				// Mock constructApi with an extended version of HedwigApi that
				// mocks the specific methods we needed mocked for this component.
				// Provide the explicit resolve/reject promise values.
				const mockedUseApiApi = useApiApi as jest.Mocked<typeof useApiApi>;
				mockedUseApiApi.constructApi.mockReturnValue(
					new (class extends HedwigApi {
						apiOrganizationsOrgIdSitesSiteIdEnrollmentsPost() {
							return new Promise<Enrollment>((_, reject) =>
								reject({
									errors: {
										'Child.FirstName': ['error'],
										'Child.LastName': ['error'],
									},
									status: 400,
								})
							);
						}
					})()
				);
			});

			it('if rendered without a child first name', async () => {
				const { findByText } = render(
					<TestProvider>
						<ChildInfo.Form
							siteId={1}
							enrollment={null}
							updateEnrollment={jest.fn()}
							error={null}
						/>
					</TestProvider>
				);

				const saveBtn = await findByText('Save');
				fireEvent.click(saveBtn);
				const firstNameInput = (await findByText('First name')).closest('div');
				expect(firstNameInput).toHaveTextContent(REQUIRED_FOR_ENROLLMENT);
			});

			it('if rendered without a child last name', async () => {
				const { findByText } = render(
					<TestProvider>
						<ChildInfo.Form
							siteId={1}
							enrollment={null}
							updateEnrollment={jest.fn()}
							error={null}
						/>
					</TestProvider>
				);

				const saveBtn = await findByText('Save');
				fireEvent.click(saveBtn);
				const lastNameInput = (await findByText('Last name')).closest('div');
				expect(lastNameInput).toHaveTextContent(REQUIRED_FOR_ENROLLMENT);
			});

			// Undo our mocking before moving on to other tests
			afterAll(() => {
				jest.resetAllMocks();
			});
		});

		// Tests for whether non-blocking errors appear on the page
		describe('non-blocking errors', () => {
			it.each([
				['Birth date', 'birthdate'],
				['Birth certificate', 'birthCertificateId'],
				['Birth certificate', 'birthTown'],
				['Birth certificate', 'birthState'],
				['Ethnicity', 'hispanicOrLatinxEthnicity'],
				['Gender', 'gender'],
			])(
				'shows %s fieldset warnings if validation error for %s field ',
				async (fieldSetLabel, field) => {
					const enrollmentWithValidationErrors = mockCompleteEnrollment as DeepNonUndefineable<
						Enrollment
					>;
					enrollmentWithValidationErrors.child.validationErrors = [getValidationError({ field })];

					const { findByLabelText, findAllByText } = render(
						<ChildInfo.Form
							siteId={1}
							enrollment={enrollmentWithValidationErrors}
							updateEnrollment={jest.fn()}
							error={null}
						/>
					);

					let fieldSet;
					// Special handling for gender, because the select ChoiceList does not actually create a FieldSet
					// TODO: should this change? for consistency
					if (field === 'gender') {
						fieldSet = (await findByLabelText(fieldSetLabel)).closest('div');
					} else {
						const [span] = (await findAllByText(fieldSetLabel)).filter(
							(elem) => elem.tagName === 'SPAN'
						);
						fieldSet = span.closest('fieldset');
					}

					expect(fieldSet).toHaveTextContent(REQUIRED_FOR_OEC_REPORTING);
				}
			);

			it('shows Race fieldset warning if validation error for race fields', async () => {
				const enrollmentWithValidationErrors = mockCompleteEnrollment as DeepNonUndefineable<
					Enrollment
				>;
				enrollmentWithValidationErrors.child.validationErrors = [
					getValidationError({
						fields: [
							'americanIndianOrAlaskaNative',
							'asian',
							'blackOrAfricanAmerican',
							'natieHawaiianOrPacificIslander',
							'white',
						],
					}),
				];

				const { findAllByText } = render(
					<ChildInfo.Form
						siteId={1}
						enrollment={enrollmentWithValidationErrors}
						updateEnrollment={jest.fn()}
						error={null}
					/>
				);

				const [span] = (await findAllByText('Race')).filter((elem) => elem.tagName == 'SPAN');
				const fieldSet = span.closest('fieldset');
				expect(fieldSet).toHaveTextContent(REQUIRED_FOR_OEC_REPORTING);
			});
		});
	});
});
