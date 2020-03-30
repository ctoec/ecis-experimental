import React from 'react';
import { render } from '@testing-library/react';
import FamilyIncome from './FamilyIncome';
import { mockCompleteEnrollment } from '../../../tests/data';
import { DeepNonUndefineable } from '../../../utils/types';
import { Enrollment, FamilyDetermination } from '../../../generated';
import { getValidationError } from '../../../tests/helpers';

jest.mock('../../../hooks/newUseApi');

describe('enrollment sections', () => {
	describe('FamilyIncome', () => {
		it('shows must be determined or marked not disclosed warning if no determinations', async () => {
			const enrollmentWithValidationErrors = { ...mockCompleteEnrollment } as DeepNonUndefineable<
				Enrollment
			>;
			enrollmentWithValidationErrors.child.family.determinations = [];
			enrollmentWithValidationErrors.child.family.validationErrors = [
				getValidationError({ field: 'determinations' }),
			];

			const { findByText } = render(
				<FamilyIncome.Form
					siteId={1}
					enrollment={enrollmentWithValidationErrors}
					mutate={async () => null}
					error={null}
				/>
			);

			const fieldSet = (await findByText('Family income')).closest('fieldset');
			expect(fieldSet).toHaveTextContent('Income must be determined or marked as not disclosed');
		});

		it.each(['numberOfPeople', 'income', 'determinationDate'])(
			'shows missing information warning if validation error for %s field',
			async field => {
				const determination = {
					validationErrors: [getValidationError({ field })],
				} as FamilyDetermination;
				const enrollmentWithValidationErrors = { ...mockCompleteEnrollment } as DeepNonUndefineable<
					Enrollment
				>;
				enrollmentWithValidationErrors.child.family.determinations = [
					determination as DeepNonUndefineable<FamilyDetermination>,
				];

				const { findByText } = render(
					<FamilyIncome.Form
						siteId={1}
						enrollment={enrollmentWithValidationErrors}
						mutate={async () => null}
						error={null}
					/>
				);

				const fieldSet = (await findByText('Family income')).closest('fieldset');
				expect(fieldSet).toHaveTextContent('This information is required for OEC reporting');
			}
		);

		it('shows warning with validation error message, not missing information warning, if determination date has value', async () => {
			const validationErrorMessage = 'TEST MESSAGE';
			const determination = {
				determinationDate: new Date(),
				validationErrors: [
					getValidationError({ field: 'determinationDate', message: validationErrorMessage }),
				],
			} as FamilyDetermination;
			const enrollmentWithValidationErrors = { ...mockCompleteEnrollment } as DeepNonUndefineable<
				Enrollment
			>;
			enrollmentWithValidationErrors.child.family.determinations = [
				determination as DeepNonUndefineable<FamilyDetermination>,
			];

			const { findByText } = render(
				<FamilyIncome.Form
					siteId={1}
					enrollment={enrollmentWithValidationErrors}
					mutate={async () => null}
					error={null}
				/>
			);
			const fieldSet = (await findByText('Family income')).closest('fieldset');
			expect(fieldSet).not.toHaveTextContent('This information is required for OEC reporting');
			expect(fieldSet).toHaveTextContent(validationErrorMessage);
		});

		it('shows must be determined warning, not must be determined or marked not disclosed warning, if validation error for notDisclosed field', async () => {
			const determination = {
				notDisclosed: true,
				validationErrors: [getValidationError({ field: 'notDisclosed' })],
			} as FamilyDetermination;
			const enrollmentWithValidationErrors = { ...mockCompleteEnrollment } as DeepNonUndefineable<
				Enrollment
			>;
			enrollmentWithValidationErrors.child.family.validationErrors = [
				getValidationError({ field: 'determinations', isSubObjectValidation: true }),
			];

			enrollmentWithValidationErrors.child.family.determinations = [
				determination as DeepNonUndefineable<FamilyDetermination>,
			];

			const { findByLabelText } = render(
				<FamilyIncome.Form
					siteId={1}
					enrollment={enrollmentWithValidationErrors}
					mutate={async () => null}
					error={null}
				/>
			);

			const someDOMElement = (await findByLabelText('Family income not disclosed')).parentElement
				?.parentElement;
			expect(someDOMElement).toHaveTextContent(
				'Income information must be disclosed for CDC funded enrollments'
			);
		});

		it('displays income information required alert if not disclosed and no notDisclosed validationError', async () => {
			const determination = {
				notDisclosed: true,
			} as FamilyDetermination;
			const enrollmentWithValidationErrors = { ...mockCompleteEnrollment } as DeepNonUndefineable<
				Enrollment
			>;
			enrollmentWithValidationErrors.child.family.determinations = [
				determination as DeepNonUndefineable<FamilyDetermination>,
			];

			const { findByLabelText } = render(
				<FamilyIncome.Form
					siteId={1}
					enrollment={enrollmentWithValidationErrors}
					mutate={async () => null}
					error={null}
				/>
			);

			const someDOMElement = (await findByLabelText('Family income not disclosed')).parentElement
				?.parentElement?.parentElement?.parentElement;
			expect(someDOMElement).toHaveTextContent(
				'Income information is required to enroll a child in a CDC funded space. You will not be able to assign this child to a funding space without this information.'
			);
		});
	});
});
