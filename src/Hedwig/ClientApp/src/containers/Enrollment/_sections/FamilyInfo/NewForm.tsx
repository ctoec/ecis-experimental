import FamilyInfo from '.';
import React, { useState, useContext, useEffect } from 'react';
import useApi, { ApiError } from '../../../../hooks/useApi';
import { useFocusFirstError } from '../../../../utils/validations';
import useCatchallErrorAlert from '../../../../hooks/useCatchallErrorAlert';
import Form from '../../../../components/Form_New/Form';
import {
	Enrollment,
	ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest,
} from '../../../../generated';
import UserContext from '../../../../contexts/User/UserContext';
import { createEmptyFamily, getIdForUser, validatePermissions } from '../../../../utils/models';
import FormSubmitButton from '../../../../components/Form_New/FormSubmitButton';
import { Address, FosterCheckbox, HomelessnessCheckbox } from './Fields';
import { SectionProps } from '../../enrollmentTypes';

export const NewForm: React.FC<SectionProps> = ({
	enrollment,
	siteId,
	error: inputError,
	successCallback,
	onSectionTouch,
	touchedSections,
}) => {
	if (!enrollment || !enrollment.child) {
		throw new Error('FamilyInfo rendered without a child');
	}

	// Can we move this duplicated logic up to a wrapper component or something?
	const { user } = useContext(UserContext);

	const [attemptSave, setAttemptSave] = useState(false);

	const initialEnrollment = {
		...{
			child: {
				family: createEmptyFamily(getIdForUser(user, 'org'), enrollment.child.familyId || 0),
			},
		},
		...enrollment,
	};

	const [mutatedEnrollment, setMutatedEnrollment] = useState<Enrollment>(
		initialEnrollment as Enrollment
	);

	const defaultParams: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest = {
		id: mutatedEnrollment.id,
		orgId: getIdForUser(user, 'org'),
		siteId: validatePermissions(user, 'site', siteId) ? siteId : 0,
		enrollment: mutatedEnrollment,
	};

	const { error: errorOnSave, data: returnedEnrollment, loading: isSaving } = useApi<Enrollment>(
		(api) => api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPut(defaultParams),
		{
			skip: !attemptSave,
			callback: () => {
				setAttemptSave(false);
				onSectionTouch && onSectionTouch(FamilyInfo);
			},
		}
	);

	// do we need this??
	const initialLoad = touchedSections ? !touchedSections[FamilyInfo.key] : false;

	// Set to input error iniitally, update with error after put is fired
	const [error, setError] = useState<ApiError | null>(inputError);
	useFocusFirstError([error]);
	useCatchallErrorAlert(error);

	const child = mutatedEnrollment.child;
	const { foster, family } = child || {};
	const { addressLine1, addressLine2, town, state, zip, homelessness } = family || {};

	useEffect(() => {
		// If the request went through, then do the next steps
		if (!returnedEnrollment && !errorOnSave) {
			return;
		}
		// Set the new error regardless of whether there is one
		setError(errorOnSave);
		if (returnedEnrollment && !errorOnSave) {
			if (successCallback) successCallback(returnedEnrollment);
		}
	}, [returnedEnrollment, errorOnSave]);

	const onFormSubmit = (userModifiedEnrollment: Enrollment) => {
		// Kick off the API request
		setAttemptSave(true);
		// Apply the mutations to the local copy of the enrollment
		setMutatedEnrollment(userModifiedEnrollment);
	};

	return (
		<Form<Enrollment>
			className="FamilyInfoForm usa-form"
			data={mutatedEnrollment}
			noValidate
			autoComplete="off"
			onSubmit={onFormSubmit}
		>
			<h2>Address</h2>
			<Address {...{ initialLoad, child, addressLine1, addressLine2, zip, state, town }} />
			<h2>Other</h2>
			<FosterCheckbox foster={foster} />
			<HomelessnessCheckbox homelessness={homelessness} />
			<FormSubmitButton text={isSaving ? 'Saving...' : 'Save'} disabled={isSaving} />
		</Form>
	);
};
