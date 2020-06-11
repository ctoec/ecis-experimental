import React, { useContext } from 'react';
import UserContext from '../../contexts/User/UserContext';
import { ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGetRequest, Enrollment } from '../../generated';
import { getIdForUser } from '../../utils/models';
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

	const props: SectionProps = {
		enrollment,
		siteId,
		
	}
	const sections: Section[] = [];
	if(hasValidationErrors(enrollment.child, undefined, true)))
	const steps = sections.map((section) => {
		const editPath = section.key;
		return { ...section, editPath } as StepProps<SectionProps>
	})
	return (
		<StepList steps={steps} props={} />
	)
}
