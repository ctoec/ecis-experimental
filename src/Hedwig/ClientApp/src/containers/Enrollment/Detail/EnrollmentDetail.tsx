import React, { useContext, useState, useEffect } from 'react';
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
import {
	validatePermissions,
	getIdForUser,
	getEnrollmentTimelineProps,
} from '../../../utils/models';
import { InlineIcon, Button, Alert } from '../../../components';
import CommonContainer from '../../CommonContainer';
import { SectionProps } from '../enrollmentTypes';
import { ProcessList } from '../../../components/ProcessList/ProcessList';
import cx from 'classnames';
import { somethingWentWrongAlert } from '../../../utils/stringFormatters/alertTextMakers';

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

	const [enrollment, updateEnrollment] = useState<Enrollment | null>(null);
	// Get enrollment by id
	const params: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGetRequest = {
		id: enrollmentId ? enrollmentId : 0,
		orgId: getIdForUser(user, 'org'),
		siteId: validatePermissions(user, 'site', siteId) ? siteId : 0,
		include: ['child', 'family', 'determinations', 'fundings', 'sites', 'past_enrollments'],
	};
	const { loading, error, data: _enrollment } = useApi<Enrollment>(
		(api) => api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGet(params),
		{
			skip: !enrollmentId || !user,
		}
	);
	useEffect(() => {
		updateEnrollment(_enrollment);
	}, [_enrollment]);

	if (loading) {
		return <div className="EnrollmentDetail">Loading...</div>;
	}

	// If we stopped loading, and still don't have these values
	// Then an error other than a validation error ocurred.
	// (Or if in staging, it is possible a new deployment
	// happened, and then a user navigates back to roster after a delay, which causes
	// 401/403 errors to occur unless a hard refresh occurs.)
	// For now, show a general purpose alert message.
	if (!enrollment) {
		return <Alert {...somethingWentWrongAlert}></Alert>;
	}

	const child = enrollment.child;

	const enrollmentHistoryProps = getEnrollmentTimelineProps(enrollment);

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
						<span className="usa-hint text-italic">
							{enrollmentDetailMetadataFormatter(enrollment)}
						</span>
					</div>
					<Button
						text="Withdraw"
						href={`/roster/sites/${siteId}/enrollments/${enrollment.id}/withdraw`}
						className="margin-right-0"
					/>
				</div>
				{sections.map((section) => {
					var props: SectionProps = { siteId, enrollment, updateEnrollment, error };
					const familyIncomeForFosterChild =
						section.key === 'family-income' && child && child.foster;
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
									to={`/roster/sites/${siteId}/enrollments/${enrollment.id}/update/${section.key}`}
									className={cx('usa-link', {
										'display-none important': familyIncomeForFosterChild,
									})}
								>
									Update<span className="usa-sr-only"> {section.name.toLowerCase()}</span>
								</Link>
							</div>
						</section>
					);
				})}
				{enrollmentHistoryProps.length > 0 && (
					<div className="padding-top-2">
						<h2>Enrollment summary</h2>
						<ProcessList
							processStepProps={enrollmentHistoryProps}
							additionalClassName="margin-left-1"
						/>
					</div>
				)}
			</div>
		</CommonContainer>
	);
}
