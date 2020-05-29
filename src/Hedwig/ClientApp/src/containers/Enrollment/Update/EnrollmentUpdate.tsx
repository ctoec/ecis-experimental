import React, { useContext, useState, useEffect } from 'react';
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
import CommonContainer from '../../CommonContainer';
import { hasValidationErrors } from '../../../utils/validations';
import AlertContext from '../../../contexts/Alert/AlertContext';
import {
	nameFormatter,
	editEnrollmentMissingInfoAlert,
	editEnrollmentCompleteAlert,
	editSaveFailAlert,
} from '../../../utils/stringFormatters';
import { ErrorBoundary, Alert } from '../../../components';
import useApi from '../../../hooks/useApi';
import { somethingWentWrongAlert } from '../../../utils/stringFormatters/alertTextMakers';

type EnrollmentUpdateParams = {
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
export default function EnrollmentUpdate({
	history,
	match: {
		params: { siteId, enrollmentId, sectionId },
	},
}: EnrollmentUpdateParams) {
	const section = sections[sectionId];
	const { user } = useContext(UserContext);
	const { setAlerts } = useContext(AlertContext);

	const [enrollment, updateEnrollment] = useState<Enrollment | null>(null);
	// Get enrollment by id
	const params: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGetRequest = {
		id: enrollmentId ? enrollmentId : 0,
		orgId: getIdForUser(user, 'org'),
		siteId: validatePermissions(user, 'site', siteId) ? siteId : 0,
		include: ['child', 'family', 'determinations', 'fundings'],
	};
	const { loading, error, data: _enrollment } = useApi(
		(api) => api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGet(params),
		{ skip: !user }
	);
	useEffect(() => {
		updateEnrollment(_enrollment);
	}, [_enrollment]);

	if (!section) {
		return <PageNotFound />;
	}

	if (loading) {
		return <div className="EnrollmentEdit">Loading...</div>;
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

	/**
	 * Accepts an enrollment and navigates back to the enrollment
	 * summary page.
	 *
	 * @param e Enrollment that was just saved.
	 */
	const afterSave = (e: Enrollment) => {
		const childName = nameFormatter(enrollment.child);
		setAlerts([
			hasValidationErrors(enrollment)
				? editEnrollmentMissingInfoAlert(childName)
				: editEnrollmentCompleteAlert(childName),
		]);
		history.push(`/roster/sites/${siteId}/enrollments/${enrollment.id}/`);
	};

	const sectionFormProps = {
		siteId,
		enrollment,
		updateEnrollment,
		error,
		successCallback: afterSave,
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
				<h1>Update {section.name.toLowerCase()}</h1>
				<h2 className="usa-intro">{nameFormatter(enrollment.child)}</h2>
				<ErrorBoundary alertProps={editSaveFailAlert}>
					{/*
						Simple object updates are completed with the same Form used during the EnrollmentNew flow.
						For more complex updates (those which expose collections), an optional UpdateForm can be provided.
					*/}
					{section.UpdateForm ? (
						<section.UpdateForm {...sectionFormProps} />
					) : (
						<section.Form {...sectionFormProps} />
					)}
				</ErrorBoundary>
			</div>
		</CommonContainer>
	);
}
