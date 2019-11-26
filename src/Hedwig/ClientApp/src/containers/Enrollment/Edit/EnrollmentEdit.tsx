import React, { useContext } from 'react';
import useAuthQuery from '../../../hooks/useAuthQuery';
import { Section } from '../enrollmentTypes';
import { History } from 'history';
import { CHILD_QUERY } from '../enrollmentQueries';
import { ChildQuery } from '../../../generated/ChildQuery';
import ChildInfo from '../_sections/ChildInfo';
// import FamilyInfo from '../_sections/FamilyInfo';
import FamilyIncome from '../_sections/FamilyIncome';
import EnrollmentFunding from '../_sections/EnrollmentFunding';
import PageNotFound from '../../PageNotFound/PageNotFound';
import UserContext from '../../../contexts/User/UserContext';
import useOASClient from '../../../hooks/useOASClient';
import { ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGetRequest, Enrollment } from '../../../OAS-generated';

type EnrollmentEditParams = {
	history: History;
	match: {
		params: {
			enrollmentId: number;
			sectionId: string;
		};
	};
};

const sections: { [key: string]: Section } = {
	'child-information': ChildInfo,
	// 'family-information': FamilyInfo,
	'family-income': FamilyIncome,
	'enrollment-funding': EnrollmentFunding,
};

export default function EnrollmentEdit({
	history,
	match: {
		params: { enrollmentId, sectionId },
	},
}: EnrollmentEditParams) {

	const section = sections[sectionId];
	const { user } = useContext(UserContext);

	const { data } = useOASClient<ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGetRequest, Enrollment>('apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGet', {
		id: enrollmentId ? enrollmentId : 0,
		orgId: (user && user.orgPermissions && user.orgPermissions[0] && user.orgPermissions[0].organizationId) || 0,
		siteId: (user && user.sitePermissions && user.sitePermissions[0] && user.sitePermissions[0].siteId) || 1,
		include: ['child', 'family', 'determinations', 'fundings']
	});

	if (!section) {
		return <PageNotFound />;
	}

	if (!data ) {
		return <div className="EnrollmentEdit"></div>;
	}

	const afterSave = () => {
		history.push(`/roster/enrollments/${enrollmentId}/`);
	};

	return (
		<div className="EnrollmentEdit">
			<section className="grid-container">
				<h1>Edit {section.name.toLowerCase()}</h1>
				<section.Form enrollment={data} afterSave={afterSave} />
			</section>
		</div>
	);
}
