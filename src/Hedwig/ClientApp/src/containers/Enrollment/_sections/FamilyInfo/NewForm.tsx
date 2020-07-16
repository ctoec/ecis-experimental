import FamilyInfo from '.';
import React, { useState, useContext, useEffect } from 'react';
import useApi, { ApiError } from '../../../../hooks/useApi';
import { useFocusFirstError } from '../../../../utils/validations';
import useCatchAllErrorAlert from '../../../../hooks/useCatchAllErrorAlert';
import {
	Enrollment,
	ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest,
} from '../../../../generated';
import UserContext from '../../../../contexts/User/UserContext';
import {
	getIdForUser,
	validatePermissions,
	enrollmentWithDefaultFamily,
} from '../../../../utils/models';
import { AddressFieldset, FosterCheckbox, HomelessnessCheckbox } from './Fields';
import { SectionProps, headerLevels } from '../../enrollmentTypes';
import { Form, FormSubmitButton } from '@ctoec/component-library';

export const NewForm: React.FC<SectionProps> = ({
	enrollment,
	siteId,
	error: inputError,
	successCallback,
	onSectionTouch,
	startingHeaderLevel = headerLevels[2],
}) => {
	if (!enrollment || !enrollment.child) {
		throw new Error('FamilyInfo rendered without a child');
	}

	// Can we move the duplicated logic in this file up to a wrapper component or something?
	const { user } = useContext(UserContext);

	const [attemptSave, setAttemptSave] = useState(false);

	// mutatedEnrollment will be submitted on section save.
	// if enrollment.child.family does not exist,
	// pre-fill family.organizationId with the organization Id
	const [mutatedEnrollment, setMutatedEnrollment] = useState<Enrollment>(
		enrollment.child.family
			? enrollment
			: enrollmentWithDefaultFamily(enrollment, getIdForUser(user, 'org'))
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

	// Set to input error iniitally, update with error after put is fired
	const [error, setError] = useState<ApiError | null>(inputError);
	useFocusFirstError([error]);
	useCatchAllErrorAlert(error);

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

	const Header = startingHeaderLevel;

	return (
		<Form<Enrollment>
			className="FamilyInfoForm usa-form"
			data={mutatedEnrollment}
			noValidate
			autoComplete="off"
			onSubmit={onFormSubmit}
		>
			<Header>Address</Header>
			<AddressFieldset />
			<Header>Other</Header>
			<FosterCheckbox />
			<HomelessnessCheckbox />
			<FormSubmitButton text={isSaving ? 'Saving...' : 'Save'} disabled={isSaving} />
		</Form>
	);
};
