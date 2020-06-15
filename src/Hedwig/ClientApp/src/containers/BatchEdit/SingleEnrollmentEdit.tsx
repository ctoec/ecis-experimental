import React, { useContext, useState } from 'react';
import UserContext from '../../contexts/User/UserContext';
import { ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGetRequest, Enrollment, ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest } from '../../generated';
import { getIdForUser, validatePermissions } from '../../utils/models';
import useApi from '../../hooks/useApi';
import StepList, { StepProps } from '../../components/StepList/StepList';
import ChildInfo from './_sections/ChildInfo';
import { Section, SectionProps } from '../Enrollment/enrollmentTypes';
import { hasValidationErrors } from '../../utils/validations';

type EnrollmentEditProps = {
	enrollmentId: number;
	siteId: number;
}

export const EnrollmentEdit: React.FC<EnrollmentEditProps> = ({
	enrollmentId,
	siteId,
}) => {
	const { user } = useContext(UserContext);
	// get the enrollment detail
	const params: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGetRequest = {
		id: enrollmentId,
		siteId,
		orgId: getIdForUser(user, 'org'),
	}

	const { error, data: enrollment, loading } = useApi<Enrollment>(
		(api) => api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGet(params),
		{ skip: !user }
	)


	if (!enrollment) {
		return <>NOT FOUND</>;
	}


	const [mutatedEnrollment, updateMutatedEnrollment] = useState<Enrollment | null>(enrollment);

	const [attemptingSave, setAttemptingSave] = useState(false);
	const putParams: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest = {
		id: enrollment.id,
		orgId: getIdForUser(user, 'org'),
		siteId: validatePermissions(user, 'site', siteId) ? siteId : 0,
		enrollment: mutatedEnrollment || undefined,
	};

	const {error: saveError, loading: isSaving, data: returnedEnrollment } = useApi<Enrollment>(
		(api) => api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPut(putParams),
		{
			skip: !attemptingSave || !user,
			callback: () => {
				setAttemptingSave(false);
			}
		}
	)
	const sections: Section[] = [];
	if(hasValidationErrors(enrollment.child, undefined, true)) {
		sections.push(ChildInfo)
	}

	const steps = sections.map((section) => {
		const editPath = section.key;
		return { ...section, editPath } as StepProps<SectionProps>
	})

	const props: SectionProps = {
		enrollment: mutatedEnrollment,
		updateEnrollment: updateMutatedEnrollment,
		siteId,
		error: saveError,
		loading: isSaving,
	};

	return (
		<StepList steps={steps} props={props} activeStep={steps.length ? steps[0].key : 'complete'}/>
	)
}
