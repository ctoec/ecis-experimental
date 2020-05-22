import React, { useState, useContext, useEffect } from 'react';
import { SectionProps } from '../../enrollmentTypes';
import Form from '../../../../components/Form_New/Form';
import {
	DeterminationDateField,
	AnnualHouseholdIncomeField,
	HouseholdSizeField,
	WithNewDetermination,
} from './Fields';
import {
	Enrollment,
	ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest,
	Family,
} from '../../../../generated';
import UserContext from '../../../../contexts/User/UserContext';
import useApi from '../../../../hooks/useApi';
import { validatePermissions, getIdForUser } from '../../../../utils/models';
import FormSubmitButton from '../../../../components/Form_New/FormSubmitButton';
import produce from 'immer';
import { DeepNonUndefineable } from '../../../../utils/types';
import { FormFieldSet } from '../../../../components/Form_New/FormFieldSet';
import { Alert } from '../../../../components';
import idx from 'idx';
import FamilyIncome from '.';
import { NotDisclosed } from './Fields/NotDisclosed';
import { displayValidationStatus } from '../../../../utils/validations/displayValidationStatus';
import useCatchAllErrorAlert from '../../../../hooks/useCatchAllErrorAlert';

export const INCOME_REQUIRED_FOR_FUNDING =
	'Income information is required enroll a child in a funded space. You will not be able to assign this child to a funding space without this information.';
/**
 * The form rendered in EnrollmentNew flow, which optionally adds a family income determination
 * to the enrollment's child's family.
 *
 * If the user marks that income is not disclosed, no family income determination will be created,
 * and the user will be shown a warning that they cannot enroll the child in a funded space without
 * this information.
 *
 * If the user doesnot mark that income is not disclosed, and does not enter any information, a new
 * determination without any values will be created, which will later trigger missing information
 * validation errors.
 */
export const NewForm = ({
	enrollment,
	updateEnrollment,
	siteId,
	successCallback,
	onSectionTouch,
	touchedSections,
}: SectionProps) => {
	// Enrollment and child must already exist to create family income data,
	// and cannot be created without user input (have required non null fields)
	if (!enrollment || !enrollment.child || !enrollment.child.family) {
		throw new Error('Section rendered without enrollment or child');
	}

	// Family must already exist to create family income data,
	// but can be created without user input with all empty defaults
	if (!enrollment.child.family) {
		updateEnrollment(
			produce<DeepNonUndefineable<Enrollment>>(
				enrollment,
				draft => (draft.child.family = {} as DeepNonUndefineable<Family>)
			)
		);
	}

	// Set up API request (enrollment PUT)
	const [attemptingSave, setAttemptingSave] = useState(false);
	const { user } = useContext(UserContext);
	const putParams: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest = {
		id: enrollment.id,
		siteId: validatePermissions(user, 'site', siteId) ? siteId : 0,
		orgId: getIdForUser(user, 'org'),
		enrollment: enrollment,
	};
	const { error: saveError, loading: saving, data: saveData } = useApi<Enrollment>(
		api => api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPut(putParams),
		{
			skip: !attemptingSave,
			callback: () => {
				setAttemptingSave(false);
				onSectionTouch && onSectionTouch(FamilyIncome);
			},
		}
	);

	// Handle API request success
	useEffect(() => {
		// API request still ongoing -- exit
		if (saving) {
			return;
		}

		// API request failed -- exit
		if (saveError) {
			return;
		}

		if (saveData) {
			if (successCallback) successCallback(saveData);
		}
	}, [saving, saveError, successCallback, saveData]);

	// Handle API error
	// display CatchAll error alert on any API error
	useCatchAllErrorAlert(saveError);

	// Skip section when child lives with foster
	if (idx(enrollment, _ => _.child.foster)) {
		successCallback && successCallback(enrollment);
	}

	/**
	 * User will first land here on their first pass through the form sections,
	 * at which point no determination exists.
	 * Default to determinationId = 0 and notDisclosed = false.
	 *
	 * User may navigate back to this section during the enrollment NEW flow.
	 * At that point, if there is a determination, use it to populate the form.
	 * If there is no determination, then they did not disclose.
	 */
	const isReturnVisit = touchedSections && touchedSections[FamilyIncome.key];
	const determinationId = idx(enrollment, _ => _.child.family.determinations[0].id) || 0;
	const [notDisclosed, setNotDisclosed] = useState(isReturnVisit ? determinationId === 0 : false);

	return (
		<>
			{notDisclosed && <Alert type="info" text={INCOME_REQUIRED_FOR_FUNDING} />}
			<Form<Enrollment>
				data={enrollment}
				onSubmit={_data => {
					updateEnrollment(_data as DeepNonUndefineable<Enrollment>);
					setAttemptingSave(true);
				}}
				className="enrollment-new-family-income-section"
			>
				<WithNewDetermination
					// create new determination if:
					// - determinationId = 0 (indicating new determination)
					// - user has not indicated that income information is not disclosed
					shouldCreate={determinationId === 0 && !notDisclosed}
				>
					{!notDisclosed && (
						<FormFieldSet<Enrollment>
							id="family-income-determination"
							legend="Family income determination"
							status={data =>
								displayValidationStatus([
									{
										type: 'warning',
										response:
											data
												.at('child')
												.at('family')
												.at('determinations')
												.find(det => det.id === determinationId)
												.at('validationErrors').value || null,
										fields: ['numberOfPeople', 'income', 'determinationDate'],
										message: 'This information is required if family income is disclosed',
									},
								])
							}
						>
							<HouseholdSizeField id={determinationId} />
							<AnnualHouseholdIncomeField id={determinationId} />
							<DeterminationDateField id={determinationId} />
						</FormFieldSet>
					)}
				</WithNewDetermination>

				<div className="margin-top-2">
					<NotDisclosed notDisclosed={notDisclosed} setNotDisclosed={setNotDisclosed} />
				</div>
				<FormSubmitButton text={saving ? 'Saving...' : 'Save'} />
			</Form>
		</>
	);
};
