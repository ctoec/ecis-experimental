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

	const putParams: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest = {
		id: enrollment.id,
		siteId: validatePermissions(user, 'site', siteId) ? siteId : 0,
		orgId: getIdForUser(user, 'org'),
		enrollment: mutatedEnrollment,
	};

	const { error: saveError } = useApi<Enrollment>(
		(api) => api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPut(putParams),
		{
			skip: !user || !attemptingSave,
			callback: () => {
				setAttemptingSave(false);
			},	
			successCallback: (returnedEnrollment) => {
				setForceCloseEditForms(true);
				setMutatedEnrollment(returnedEnrollment);
			},
		}
	);

	useEffect(() => {
		// Re-enable opening edit forms to allow the user to make
		// multiple edits per page visit
		if(forceCloseEditForms) setTimeout(() => setForceCloseEditForms(false));
	}, [forceCloseEditForms]);

	const formOnSubmit = (_data: Enrollment) => {
		setMutatedEnrollment(_data);
		setAttemptingSave(true);
	};

	const updateFormSectionProps = {
		mutatedEnrollment,
		formOnSubmit,
		saveError,
		forceCloseEditForms
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
