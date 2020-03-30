import React from 'react';
import { render } from '@testing-library/react';
import ChildInfo from './ChildInfo';
import { DeepNonUndefineable } from '../../../utils/types';
import { Enrollment } from '../../../generated';
import { mockCompleteEnrollment } from '../../../tests/data';
import { getValidationError } from '../../../tests/helpers';

jest.mock('../../../hooks/newUseApi');

describe('enrollment sections', () => {
	describe('ChildInfo', () => {
		it('shows an error if rendered without a child first name', async () => {
			const { findByText } = render(
				<ChildInfo.Form
					siteId={1}
					enrollment={{} as DeepNonUndefineable<Enrollment>}
					error={{
						errors: { 'Child.FirstName': ['error'] },
						status: 400,
					}}
				/>
			);

			const firstNameInput = (await findByText('First name')).closest('div');
			expect(firstNameInput).toHaveTextContent('This information is required for enrollment');
		});

		it('shows an error if rendered without a child last name', async () => {
			const { findByText } = render(
				<ChildInfo.Form
					siteId={1}
					enrollment={{} as DeepNonUndefineable<Enrollment>}
					mutate={async () => null}
					error={{
						errors: { 'Child.LastName': ['error'] },
						status: 400,
					}}
				/>
			);
			const lastNameInput = (await findByText('Last name')).closest('div');
			expect(lastNameInput).toHaveTextContent('This information is required for enrollment');
		});

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
						mutate={async () => null}
						error={null}
					/>
				);

				let fieldSet;
				// special handling for gender, because the select ChoiceList does not actually create a FieldSet
				// TODO: should this change? for consistency
				if (field === 'gender') {
					fieldSet = (await findByLabelText(fieldSetLabel)).closest('div');
				} else {
					const [span] = (await findAllByText(fieldSetLabel)).filter(
						elem => elem.tagName === 'SPAN'
					);
					fieldSet = span.closest('fieldset');
				}

				expect(fieldSet).toHaveTextContent('This information is required for OEC reporting');
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
					mutate={async () => null}
					error={null}
				/>
			);

			const [span] = (await findAllByText('Race')).filter(elem => elem.tagName == 'SPAN');
			const fieldSet = span.closest('fieldset');
			expect(fieldSet).toHaveTextContent('This information is required for OEC reporting');
		});
	});
});
