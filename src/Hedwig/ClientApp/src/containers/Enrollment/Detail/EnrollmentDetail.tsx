import React, { useContext } from 'react';
import ChildInfo from '../_sections/ChildInfo';
import FamilyInfo from '../_sections/FamilyInfo';
import FamilyIncome from '../_sections/FamilyIncome';
import EnrollmentFunding from '../_sections/EnrollmentFunding';
import { Link } from 'react-router-dom';
import nameFormatter from '../../../utils/nameFormatter';
import {
	ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGetRequest,
	Enrollment,
} from '../../../generated';
import UserContext from '../../../contexts/User/UserContext';
import useApi from '../../../hooks/useApi';
import DirectionalLink from '../../../components/DirectionalLink/DirectionalLink';
import Alert from '../../../components/Alert/Alert';
import getIdForUser from '../../../utils/getIdForUser';
import missingInformation from '../../../utils/missingInformation';
import InlineIcon from '../../../components/InlineIcon/InlineIcon';
import { DeepNonUndefineable } from '../../../utils/types';

type EnrollmentDetailParams = {
	match: {
		params: {
			enrollmentId?: number;
		};
	};
};

const sections = [ChildInfo, FamilyInfo, FamilyIncome, EnrollmentFunding];

/**
 * React component for displaying enrollment summary information.
 * Hands off to section summary component.
 * 
 * @param props Props with location
 */
export default function EnrollmentDetail({
	match: {
		params: { enrollmentId },
	},
}: EnrollmentDetailParams) {
	const { user } = useContext(UserContext);

	// Get enrollment by id
	const params: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGetRequest = {
		id: enrollmentId ? enrollmentId : 0,
		orgId: getIdForUser(user, 'org'),
		siteId: getIdForUser(user, 'site'),
		include: ['child', 'family', 'determinations', 'fundings', 'sites'],
	};
	const [loading, error, enrollment, mutate] = useApi<Enrollment>(
		api => api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGet(params),
		[enrollmentId, user],
		{
			skip: !enrollmentId,
		}
	);

	if (loading || error || !enrollment) {
		return <div className="EnrollmentDetail"></div>;
	}

	const child = enrollment.child;
	const informationIsMissing = missingInformation(enrollment);

	return (
		<div className="EnrollmentDetail">
			<section className="grid-container">
				<DirectionalLink direction="left" to="/roster" text="Back to roster" />
				{informationIsMissing && (
					<Alert
						type="warning"
						heading="Missing information"
						text={`${nameFormatter(
							child
						)} has been successfully enrolled, however, they are missing information required to submit the monthly CDC report. You will be reminded to update this information before you can submit the report.`}
					/>
				)}
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
							{/* TODO: when we figure out the missing information logic, remove hard coding of section */}
							{section === ChildInfo && informationIsMissing && (
								<span>
									<InlineIcon icon="incomplete" /> Missing information
								</span>
							)}
						</div>
					</section>
				))}
			</section>
		</div>
	);
}
