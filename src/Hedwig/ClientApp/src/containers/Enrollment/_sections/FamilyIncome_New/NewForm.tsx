import React, { useState, useContext } from 'react';
import { SectionProps } from "../../enrollmentTypes";
import Form from "../../../../components/Form_New/Form";
import { DeterminationDateField, AnnualHouseholdIncomeField, HouseholdSizeField, WithNewDetermination } from './Fields';
import { Enrollment, ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest, Family } from '../../../../generated';
import UserContext from '../../../../contexts/User/UserContext';
import useApi from '../../../../hooks/useApi';
import { validatePermissions, getIdForUser } from '../../../../utils/models';
import FormSubmitButton from '../../../../components/Form_New/FormSubmitButton';
// import useCatchallErrorAlert from '../../../../hooks/useCatchallErrorAlert';
import produce from 'immer';
import { DeepNonUndefineable } from '../../../../utils/types';
import { FormFieldSet } from '../../../../components/Form_New/FormFieldSet';
import { warningForFieldSet } from '../../../../utils/validations';
import { REQUIRED_FOR_OEC_REPORTING } from '../../../../utils/validations/messageStrings';
import Checkbox from '../../../../components/Checkbox/Checkbox';
import { Alert } from '../../../../components';

export const NewForm = ({
	enrollment,
	updateEnrollment,
	siteId,
	loading,
	successCallback,
}: SectionProps) => {
	// Enrollment and child must already exist to create family income data,
	// and cannot be created without user input (have required non null fields)
	if(!enrollment || !enrollment.child || !enrollment.child.family) {
		throw new Error('Section rendered without enrollment or child');
	}

	// Family must already exist to create family income data,
	// but can be created without user input with all empty defaults
	if(!enrollment.child.family) {
		updateEnrollment(produce<DeepNonUndefineable<Enrollment>>(
			enrollment, draft => draft.child.family = {} as DeepNonUndefineable<Family>
		))
	}

	// Set up API request (enrollment PUT)
	const [attemptingSave, setAttemptingSave] = useState(false);
	const { user } = useContext(UserContext);
	const putParams: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest = {
		id: enrollment.id,
		siteId: validatePermissions(user, 'site', siteId) ? siteId : 0,
		orgId: getIdForUser(user, 'org'),
		enrollment
	};
	const { error: saveError, loading: saving } = useApi<Enrollment>(
		api => api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPut(putParams),
		{
			skip: !user || !attemptingSave,
			callback: () => {
				setAttemptingSave(false);
			}
		}
	);

	const [notDisclosed, setNotDisclosed] = useState(false);

	// Use catchall error to display a catchall error alert on _any_ saveError,
	// since no form fields have field-specific error alerting
	// useCatchallErrorAlert(saveError);

	if(loading) {
		return <>Loading...</>
	};

	// The form to create a first family determination on EnrollmentNew flow
	return (
		<Form<Enrollment>
			data={enrollment}
			onSubmit={(_data) => {
				setAttemptingSave(true);
				updateEnrollment(_data as DeepNonUndefineable<Enrollment>);
				if(successCallback) successCallback(_data);
			}}
			className="enrollment-new-family-income-section"
		>
			<WithNewDetermination
				shouldCreate={!notDisclosed}
				shouldCleanUp={notDisclosed}
			>
				{!notDisclosed &&
					<FormFieldSet<Enrollment>
						id="family-income-determination"
						legend="Family income determination"
						status={(data) => {
							const det = data.at('child').at('family').at('determinations').at(0).value;
							return warningForFieldSet(
								'family-income-determination',
								['numberOfPeople', 'income', !det.determinationDate ? 'determinationDate' : ''],
								det,
								REQUIRED_FOR_OEC_REPORTING
							)
						}}
					>
						<HouseholdSizeField id={0}/>
						<AnnualHouseholdIncomeField id={0} />
						<DeterminationDateField id={0} />
					</FormFieldSet>
				}
			</WithNewDetermination>

			<Checkbox
				id="not-disclosed"
				text="Family income not disclosed"
				value="not-disclosed"
				onChange={e => setNotDisclosed(e.target.checked)}
			/>
			{notDisclosed && <Alert type="info" text="Income information is required enroll a child in a funded space. You will not be able to assign this child to a funding space without this information." />}

			<FormSubmitButton text={saving ? 'Saving...' : 'Save'} />
		</Form>
	)
};
