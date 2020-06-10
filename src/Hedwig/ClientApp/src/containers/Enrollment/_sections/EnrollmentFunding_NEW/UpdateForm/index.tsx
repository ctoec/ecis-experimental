import React, { useState, useContext, useEffect } from 'react';
import { TabNav } from '../../../../../components/TabNav/TabNav';
import { EnrollmentFundingForm } from './EnrollmentFunding';
import { Care4KidsForm } from './Care4Kids';
import { SectionProps } from '../../../enrollmentTypes';
import {
	Enrollment,
	ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest,
} from '../../../../../generated';
import UserContext from '../../../../../contexts/User/UserContext';
import { validatePermissions, getIdForUser } from '../../../../../utils/models';
import useApi from '../../../../../hooks/useApi';

export const UpdateForm: React.FC<SectionProps> = ({ enrollment, siteId }) => {
	if (!enrollment) {
		throw new Error('Section rendered without enrollment');
	}

	const { user } = useContext(UserContext);
	const [forceCloseEditForms, setForceCloseEditForms] = useState(false);

	const [mutatedEnrollment, setMutatedEnrollment] = useState<Enrollment>(enrollment);
	const [attemptingSave, setAttemptingSave] = useState(false);

	const renameToAvoidCodeDupeError: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest = {
		id: enrollment.id,
		siteId: validatePermissions(user, 'site', siteId) ? siteId : 0,
		orgId: getIdForUser(user, 'org'),
		enrollment: mutatedEnrollment,
	};

	const { error: saveError, loading: isSaving, data: returnedEnrollment } = useApi<Enrollment>(
		(api) => api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPut(renameToAvoidCodeDupeError),
		{
			skip: !user || !attemptingSave,
			callback: () => {
				setAttemptingSave(false);
			},
		}
	);

	// Handle successful API request
	useEffect(() => {
		// If the request is still loading or
		// If the request produced an error,
		// Do nothing
		if (isSaving || saveError) {
			return;
		}

		// If the request successed, process the response
		if (returnedEnrollment) {
			setMutatedEnrollment(returnedEnrollment);
			setForceCloseEditForms(true);
		}
	});

	const updateFormSectionProps = {
		mutatedEnrollment,
		setMutatedEnrollment,
		setAttemptingSave,
		saveError,
		forceCloseEditForms,
	};
	return (
		<TabNav
			items={[
				{
					text: 'Enrollment/Funding',
					content: <EnrollmentFundingForm {...updateFormSectionProps} />,
					default: true,
				},
				{ text: 'Care 4 Kids', content: <Care4KidsForm {...updateFormSectionProps} /> },
			]}
		/>
	);
};
