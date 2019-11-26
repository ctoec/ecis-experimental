import React, { useContext } from 'react';
import useAuthQuery from '../../../hooks/useAuthQuery';
import { CHILD_QUERY } from '../enrollmentQueries';
import { ChildQuery } from '../../../generated/ChildQuery';
import ChildInfo from '../_sections/ChildInfo';
// import FamilyInfo from '../_sections/FamilyInfo';
import FamilyIncome from '../_sections/FamilyIncome';
import EnrollmentFunding from '../_sections/EnrollmentFunding';
import { Link } from 'react-router-dom';
import nameFormatter from '../../../utils/nameFormatter';
import useOASClient from '../../../hooks/useOASClient';
import { ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGetRequest, Enrollment } from '../../../OAS-generated';
import UserContext from '../../../contexts/User/UserContext';

type EnrollmentDetailParams = {
	match: {
		params: {
			siteId?: string;
			enrollmentId?: number;
		};
	};
};


// const sections = [ChildInfo, FamilyInfo, FamilyIncome, EnrollmentFunding];
const sections = [ChildInfo, FamilyIncome, EnrollmentFunding];

export default function EnrollmentDetail({
	match: {
		params: { siteId, enrollmentId }
	},
}: EnrollmentDetailParams) {
	const { user } = useContext(UserContext);
	const { data } = useOASClient<ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGetRequest, Enrollment>('apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGet', {
		id: enrollmentId ? enrollmentId : 0,
		orgId: (user && user.orgPermissions && user.orgPermissions[0] && user.orgPermissions[0].organizationId) || 0,
		siteId: (user && user.sitePermissions && user.sitePermissions[0] && user.sitePermissions[0].siteId) || 1,
		include: ['child', 'family', 'determinations', 'fundings']
	});


	if (!data) {
		return <div className="EnrollmentNew"></div>;
	}

	const enrollment = data;
	const child = enrollment.child;

	return (
		<div className="EnrollmentDetail">
			<section className="grid-container">
				{/* <h1>{nameFormatter(child)}</h1> */}
				{sections.map(section => (
					<section key={section.key} className="hedwig-enrollment-details-section">
						<div className="hedwig-enrollment-details-section__content">
							<h2>{section.name}</h2>
							<section.Summary enrollment={enrollment} />
						</div>
						<div className="hedwig-enrollment-details-section__actions">
							<Link to={`edit/${section.key}`}>
								Edit<span className="usa-sr-only"> {section.name.toLowerCase()}</span>
							</Link>
						</div>
					</section>
				))}
			</section>
		</div>
	);
}
