import React, { useContext } from 'react';
import ChildInfo from '../_sections/ChildInfo';
import FamilyInfo from '../_sections/FamilyInfo';
import FamilyIncome from '../_sections/FamilyIncome';
import EnrollmentFunding from '../_sections/EnrollmentFunding';
import { Link } from 'react-router-dom';
import { nameFormatter, enrollmentDetailMetadataFormatter } from '../../../utils/stringFormatters';
import {
	ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGetRequest,
	Enrollment,
} from '../../../generated';
import UserContext from '../../../contexts/User/UserContext';
import useApi from '../../../hooks/useApi';
import { validatePermissions, getIdForUser } from '../../../utils/models';
import { InlineIcon, Button } from '../../../components';
import CommonContainer from '../../CommonContainer';
import { SectionProps } from '../enrollmentTypes';

type EnrollmentDetailParams = {
	match: {
		params: {
			siteId: number;
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
		params: { siteId, enrollmentId },
	},
}: EnrollmentDetailParams) {
	const { user } = useContext(UserContext);

	// Get enrollment by id
	const params: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGetRequest = {
		id: enrollmentId ? enrollmentId : 0,
		orgId: getIdForUser(user, 'org'),
		siteId: validatePermissions(user, 'site', siteId) ? siteId : 0,
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

	return (
		<CommonContainer
			directionalLinkProps={{
				direction: 'left',
				to: '/roster',
				text: 'Back to roster',
			}}
		>
			<div className="grid-container">
				<div className="grid-row flex-first-baseline flex-space-between">
					<div>
						<h1>{nameFormatter(child)}</h1>
						<span className="usa-hint text-italic">{enrollmentDetailMetadataFormatter(enrollment)}</span>
					</div>
					<Button text="Withdraw" href={`/roster/sites/${siteId}/enrollments/${enrollment.id}/withdraw`} className="margin-right-0" />
				</div>
				{sections.map(section => {
					var props: SectionProps = { siteId, enrollment, mutate };
					const familyIncomeForFosterChild = section.key === 'family-income' && child.foster;
					return (
						<section key={section.key} className="oec-enrollment-details-section">
							<div className="oec-enrollment-details-section__content">
								<h2>{section.name}</h2>
								<section.Summary {...props} />
							</div>
							<div className="oec-enrollment-details-section__actions">
								{section.status(props) === 'incomplete' && (
									<span>
										<InlineIcon icon="incomplete" /> Missing information
									</span>
								)}
								<Link
									to={`/roster/sites/${siteId}/enrollments/${enrollment.id}/edit/${section.key}`}
									className={familyIncomeForFosterChild ? 'display-none important' : ''}
								>
									Edit<span className="usa-sr-only"> {section.name.toLowerCase()}</span>
								</Link>
							</div>
						</section>
					);
				})}
			</div>
		</CommonContainer>
	);
}
