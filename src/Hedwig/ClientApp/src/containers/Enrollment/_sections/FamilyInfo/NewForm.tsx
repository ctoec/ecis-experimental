import FamilyInfo from './FamilyInfo';
import React, { useState, useReducer, useContext, useEffect } from 'react';
import useApi, { ApiError } from '../../../../hooks/useApi';
import { useFocusFirstError } from '../../../../utils/validations';
import useCatchallErrorAlert from '../../../../hooks/useCatchallErrorAlert';
import { FormReducer, formReducer, updateData } from '../../../../utils/forms/form';
import { DeepNonUndefineable } from '../../../../utils/types';
import {
	Enrollment,
	ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest,
} from '../../../../generated';
import UserContext from '../../../../contexts/User/UserContext';
import {
	createEmptyFamily,
	getIdForUser,
	validatePermissions,
} from '../../../../utils/models';
import FormSubmitButton from '../../../../components/Form_New/FormSubmitButton';
import { Address, FosterCheckbox, HomelessnessCheckbox } from './Fields';

export const Form = ({
	enrollment,
	siteId,
	error: inputError,
	successCallback,
	onSectionTouch,
	touchedSections,
}: any) => {
	if (!enrollment || !enrollment.child) {
		throw new Error('FamilyInfo rendered without a child');
	}

	// set up form state
	const initialLoad = touchedSections ? !touchedSections[FamilyInfo.key] : false;
	const [error, setError] = useState<ApiError | null>(inputError);

	useFocusFirstError([error]);
	useCatchallErrorAlert(error);

	const [_enrollment, updateEnrollment] = useReducer<FormReducer<DeepNonUndefineable<Enrollment>>>(
		formReducer,
		enrollment
	);
	const updateFormData = updateData<DeepNonUndefineable<Enrollment>>(updateEnrollment);

	const { user } = useContext(UserContext);

	if (!_enrollment.child.family) {
		// If there isn't a family, create one-- otherwise user can save section without making one
		updateFormData(e => e.value)({
			name: 'child.family',
			value: createEmptyFamily(getIdForUser(user, 'org'), enrollment.child.familyId || 0),
		});
	}
	const child = _enrollment.child;
	const { foster, family } = child;
	const { addressLine1, addressLine2, town, state, zip, homelessness } = family || {};

	const defaultParams: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest = {
		id: _enrollment.id,
		orgId: getIdForUser(user, 'org'),
		siteId: validatePermissions(user, 'site', siteId) ? siteId : 0,
		enrollment: _enrollment,
	};

	const [attemptingSave, setAttemptingSave] = useState(false);
	const { error: saveError, data: saveData } = useApi<Enrollment>(
		api => api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPut(defaultParams),
		{
			skip: !attemptingSave,
			callback: () => {
				setAttemptingSave(false);
				onSectionTouch && onSectionTouch(FamilyInfo);
			},
		}
	);

	useEffect(() => {
		// If the request went through, then do the next steps
		if (!saveData && !saveError) {
			return;
		}
		// Set the new error regardless of whether there is one
		setError(saveError);
		if (saveData && !saveError) {
			if (successCallback) successCallback(saveData);
		}
	}, [saveData, saveError]);

	return (
		<Form
			data={_enrollment}
			className="FamilyInfoForm usa-form"
			noValidate
			autoComplete="off"
			onSubmit={() => setAttemptingSave(true)}
		>
			<h2>Address</h2>
			<Address {...{ initialLoad, child, addressLine1, addressLine2, zip, state, updateFormData, town }} />
			<h2>Other</h2>
			<FosterCheckbox foster={foster} updateFormData={updateFormData} />
			<HomelessnessCheckbox homelessness={homelessness} updateFormData={updateFormData} />
			<FormSubmitButton text={attemptingSave ? 'Saving...' : 'Save'} disabled={attemptingSave} />
		</Form>
	);
};
