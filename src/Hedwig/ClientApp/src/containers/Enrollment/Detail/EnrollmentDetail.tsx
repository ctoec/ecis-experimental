import React, { useContext } from 'react';
import ChildInfo from '../_sections/ChildInfo';
import FamilyInfo from '../_sections/FamilyInfo';
import FamilyIncome from '../_sections/FamilyIncome';
import EnrollmentFunding from '../_sections/EnrollmentFunding';
import { Link } from 'react-router-dom';
import nameFormatter from '../../../utils/nameFormatter';
import { ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGetRequest, Enrollment } from '../../../OAS-generated';
import UserContext from '../../../contexts/User/UserContext';
import useApi from '../../../hooks/useApi';
import DirectionalLink from '../../../components/DirectionalLink/DirectionalLink';
import getIdForUser from '../../../utils/getIdForUser';


type EnrollmentDetailParams = {
	match: {
		params: {
			enrollmentId?: number;
		};
	};
};

const sections = [ChildInfo, FamilyInfo, FamilyIncome, EnrollmentFunding];

export default function EnrollmentDetail({
	match: {
		params: { enrollmentId }
	},
}: EnrollmentDetailParams) {
	const { user } = useContext(UserContext);
	const params: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGetRequest = {
		id: enrollmentId ? enrollmentId : 0,
		orgId: getIdForUser(user, "org"),
		siteId: getIdForUser(user, "site"),
		include: ['child', 'family', 'determinations', 'fundings', 'sites']
	}
	const [loading, error, enrollment, mutate] = useApi<Enrollment>(
		(api) => api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGet(params),
		[enrollmentId, user],
		undefined,
		!enrollmentId
	);

	if (loading || error || !enrollment) {
		return <div className="EnrollmentDetail"></div>;
	}

	const child = enrollment.child;

	return (
		<div className="EnrollmentDetail">
			<section className="grid-container">
				<DirectionalLink direction="left" to="/roster" text="Back to roster" />
				<h1>{nameFormatter(child)}</h1>
				{sections.map(section => (
					<section key={section.key} className="hedwig-enrollment-details-section">
						<div className="hedwig-enrollment-details-section__content">
							<h2>{section.name}</h2>
							<section.Summary enrollment={enrollment} mutate={mutate} />
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
