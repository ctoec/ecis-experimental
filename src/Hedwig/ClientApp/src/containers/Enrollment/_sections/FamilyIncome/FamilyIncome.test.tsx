import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import FamilyIncome from '.';
import { mockCompleteEnrollment } from '../../../../tests/data';
import { DeepNonUndefineable } from '../../../../utils/types';
import { Enrollment, FamilyDetermination } from '../../../../generated';
import { getValidationError } from '../../../../tests/helpers';
import {
	REQUIRED_FOR_OEC_REPORTING,
	INFORMATION_REQUIRED_IF_INCOME_DISCLOSED,
	INCOME_REQUIRED_FOR_FUNDING_ALERT_TEXT,
} from '../../../../utils/validations/messageStrings';

jest.mock('../../../../hooks/useApi/api');
jest.mock('../../../../hooks/useApi/error');

describe('enrollment sections', () => {
	describe('FamilyIncome', () => {
		describe('Form', () => {
			it.each(['numberOfPeople', 'income', 'determinationDate'])(
				'shows missing information warning if validation error for %s field',
				async (field) => {
					const determination = {
						id: 1,
						validationErrors: [getValidationError({ field })],
					} as DeepNonUndefineable<FamilyDetermination>;

					const enrollmentWithIncompleteDetermination = {
						...mockCompleteEnrollment,
					} as DeepNonUndefineable<Enrollment>;
					enrollmentWithIncompleteDetermination.child.family.determinations = [determination];

					const { getByText } = render(
						<FamilyIncome.Form
							siteId={1}
							updateEnrollment={jest.fn()}
							enrollment={enrollmentWithIncompleteDetermination}
							error={null}
						/>
					);

					const fieldSet = (await getByText('Family income determination')).closest('fieldset');
					expect(fieldSet).toHaveTextContent(INFORMATION_REQUIRED_IF_INCOME_DISCLOSED);
				}
			);

			it('shows info alert if family income not disclosed', async () => {
				const { getByLabelText, getByText } = render(
					<FamilyIncome.Form
						siteId={1}
						updateEnrollment={jest.fn()}
						enrollment={mockCompleteEnrollment as DeepNonUndefineable<Enrollment>}
						error={null}
					/>
				);

				const notDisclosedCheckbox = await getByLabelText('Family income not disclosed');
				fireEvent.click(notDisclosedCheckbox);

				const infoAlert = getByText(INCOME_REQUIRED_FOR_FUNDING_ALERT_TEXT);
				expect(infoAlert).toBeInTheDocument();
			});
		});

		describe('UpdateForm', () => {
			it.each(['numberOfPeople', 'income', 'determinationDate'])(
				'shows missing information icons for validation errors for %s field',
				async (field) => {
					const determinationWithValidationErrors = {
						id: 1,
						validationErrors: [getValidationError({ field })],
					} as DeepNonUndefineable<FamilyDetermination>;

					const enrollment = { ...mockCompleteEnrollment } as DeepNonUndefineable<Enrollment>;
					enrollment.child.family.determinations = [determinationWithValidationErrors];

					if (FamilyIncome.UpdateForm) {
						const { findByText, findAllByText } = render(
							<FamilyIncome.UpdateForm
								siteId={1}
								updateEnrollment={jest.fn()}
								enrollment={enrollment}
								error={null}
							/>
						);

						const editBtn = await findByText('Edit');
						fireEvent.click(editBtn);

						const [fieldSetLegend] = (await findAllByText('Edit family income')).filter(
							(elem) => elem.tagName === 'SPAN'
						);
						const fieldSet = fieldSetLegend.closest('fieldset');
						expect(fieldSet).toHaveTextContent(REQUIRED_FOR_OEC_REPORTING);
					}
				}
			);

			it('shows a collapsed card for each determination', () => {
				const enrollment = { ...mockCompleteEnrollment } as DeepNonUndefineable<Enrollment>;
				if (FamilyIncome.UpdateForm) {
					const { getAllByText } = render(
						<FamilyIncome.UpdateForm
							siteId={1}
							updateEnrollment={jest.fn()}
							enrollment={enrollment}
							error={null}
						/>
					);

					const hiddenHhSizeLabels = getAllByText('Household size');
					// There should be one label per determination
					expect(hiddenHhSizeLabels).toHaveLength(
						(enrollment.child.family.determinations || []).length
					);
				}
			});

			it('shows edit form when user clicks "Edit"', () => {
				const enrollment = { ...mockCompleteEnrollment } as DeepNonUndefineable<Enrollment>;
				enrollment.child.family.determinations = [
					{
						id: 10,
					} as DeepNonUndefineable<FamilyDetermination>,
				];

				if (FamilyIncome.UpdateForm) {
					const { getByText, getAllByText, queryAllByText } = render(
						<FamilyIncome.UpdateForm
							siteId={1}
							updateEnrollment={jest.fn()}
							enrollment={enrollment}
							error={null}
						/>
					);

					// Edit family income form should not be visible
					// until user clicks Edit
					expect(queryAllByText('Edit family income')).toHaveLength(0);

					// Click button to expand card
					const editBtn = getByText('Edit');
					fireEvent.click(editBtn);

					// After button click, previously hidden form should be visible
					const [editFormLegend] = getAllByText('Edit family income');
					expect(editFormLegend).toBeVisible();
				}
			});

			it('shows redetermination form when user clicks "Add new income determination"', async () => {
				if (FamilyIncome.UpdateForm) {
					const { getByText, getAllByText, queryByText } = render(
						<FamilyIncome.UpdateForm
							siteId={1}
							updateEnrollment={jest.fn()}
							enrollment={mockCompleteEnrollment as DeepNonUndefineable<Enrollment>}
							error={null}
						/>
					);

					// Add new family income form should not exist in the dom
					// until user invokes it
					expect(queryByText('Redetermine family income')).toBeNull();

					// Click button to display form
					const addNewBtn = getByText('Add new income determination');
					fireEvent.click(addNewBtn);

					// After button click, previously missing form should exist
					const [addNewFormLegend] = getAllByText('Redetermine family income');
					expect(addNewFormLegend).toBeInTheDocument();
				}
			});
		});
	});
});
