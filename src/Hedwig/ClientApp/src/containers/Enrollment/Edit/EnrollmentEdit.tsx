import React, { useContext } from 'react';
import { Section } from '../enrollmentTypes';
import { History } from 'history';
import ChildInfo from '../_sections/ChildInfo';
import FamilyInfo from '../_sections/FamilyInfo';
import FamilyIncome from '../_sections/FamilyIncome';
import EnrollmentFunding from '../_sections/EnrollmentFunding';
import PageNotFound from '../../PageNotFound/PageNotFound';
import UserContext from '../../../contexts/User/UserContext';
import {
	Enrollment,
	ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGetRequest,
} from '../../../generated';
import { validatePermissions, getIdForUser } from '../../../utils/models';
import useApi from '../../../hooks/useApi';
import CommonContainer from '../../CommonContainer';
import { hasValidationErrors } from '../../../utils/validations';
import AlertContext from '../../../contexts/Alert/AlertContext';
import {
	nameFormatter,
	editEnrollmentMissingInfoAlert,
	editEnrollmentCompleteAlert,
	editSaveFailAlert,
} from '../../../utils/stringFormatters';
import { ErrorBoundary } from '../../../components';

type EnrollmentEditParams = {
	history: History;
	match: {
		params: {
			siteId: number;
			enrollmentId: number;
			sectionId: string;
		};
	};
};

const sections: { [key: string]: Section } = {
	'child-information': ChildInfo,
	'family-information': FamilyInfo,
	'family-income': FamilyIncome,
	'enrollment-funding': EnrollmentFunding,
};

/**
 * React component for editing an enrollment. Hands off to a section
 * form component.
 *
 * @param props Props with location.
 */
export default function EnrollmentEdit({
	history,
	match: {
		params: { siteId, enrollmentId, sectionId },
	},
}: EnrollmentEditParams) {
	const section = sections[sectionId];
	const { user } = useContext(UserContext);
	const { setAlerts } = useContext(AlertContext);

	// Get enrollment by id
	const params: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGetRequest = {
		id: enrollmentId ? enrollmentId : 0,
		orgId: getIdForUser(user, 'org'),
		siteId: validatePermissions(user, 'site', siteId) ? siteId : 0,
		include: ['child', 'family', 'determinations', 'fundings'],
	};
	const [loading, error, enrollment, mutate] = useApi(
		api => api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGet(params),
		[user]
	);

	if (!section) {
		return <PageNotFound />;
	}

	if (loading || !enrollment) {
		return <div className="EnrollmentEdit"></div>;
	}

	/**
	 * Accepts an enrollment and navigates back to the enrollment
	 * summary page.
	 *
	 * @param enrollment Enrollment that was just saved.
	 */
	const afterSave = (enrollment: Enrollment) => {
		const childName = nameFormatter(enrollment.child);
		setAlerts([
			hasValidationErrors(enrollment)
				? editEnrollmentMissingInfoAlert(childName)
				: editEnrollmentCompleteAlert(childName),
		]);
		history.push(`/roster/sites/${siteId}/enrollments/${enrollment.id}/`);
	};

	return (
		<CommonContainer
			directionalLinkProps={{
				direction: 'left',
				to: `/roster/sites/${siteId}/enrollments/${enrollment.id}/`,
				text: `Back to enrollment details`,
			}}
		>
			<div className="grid-container">
				<h1>Edit {section.name.toLowerCase()}</h1>
				<p className="usa-intro">{nameFormatter(enrollment.child)}</p>
				<ErrorBoundary alertProps={editSaveFailAlert}>
					<section.Form
						siteId={siteId}
						enrollment={enrollment}
						mutate={mutate}
						error={error}
						successCallback={afterSave}
					/>
				</ErrorBoundary>
			</div>
		</CommonContainer>
	);
}
