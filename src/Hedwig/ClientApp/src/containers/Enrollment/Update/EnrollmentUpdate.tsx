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
	ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest,
} from '../../../generated';
import { validatePermissions, getIdForUser } from '../../../utils/models';
import CommonContainer from '../../CommonContainer';
import { nameFormatter, editSaveFailAlert } from '../../../utils/stringFormatters';
import { ErrorBoundary } from '../../../components';
import useApi from '../../../hooks/useApi';
import { DeepNonUndefineable } from '../../../utils/types';

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
 * React component for updating an enrollment. Renders a section
 * update form component.
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
	const [attemptingSave, setAttemptingSave] = useState(false);
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

	const saveParams: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest = {
		id: enrollment ? enrollment.id : 0,
		orgId: getIdForUser(user, 'org'),
		siteId: validatePermissions(user, 'site', siteId) ? siteId : 0,
		enrollment: enrollment || undefined,
	};
	const { loading: saveLoading, error: saveError, data: saveData } = useApi<Enrollment>(
		(api) => api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPut(saveParams),
		{ skip: !attemptingSave || !user, callback: () => setAttemptingSave(false) }
	);
	useEffect(() => {
		// If the request went through, then do the next steps
		if (!saveData && !saveError) {
			return;
		}
		// Set the new error regardless of whether there is one
		if (saveData && !saveError) {
			updateEnrollment(saveData);
		} else {
		}
	}, [saveData, saveError]);

	if (!section) {
		return <PageNotFound />;
	}

	if (loading || !enrollment) {
		return <div className="EnrollmentUpdate"></div>;
	}

	// If update hasn't been implemented, default to edit
	if (!section.UpdateForm) {
		history.push(`/roster/sites/${siteId}/enrollments/${enrollment.id}/edit/${sectionId}`);
		return <></>;
	}

	return (
		<CommonContainer
			directionalLinkProps={{
				direction: 'left',
				to: `/roster/sites/${siteId}/enrollments/${enrollment.id}/`,
				text: `Back to summary`,
			}}
		>
			<div className="grid-container">
				<h1 className="margin-y-4">
					Update {section.name.toLowerCase()} for {nameFormatter(enrollment.child)}
				</h1>
				<ErrorBoundary alertProps={editSaveFailAlert}>
					<section.UpdateForm
						siteId={siteId}
						updateEnrollment={(enrollment) => {
							updateEnrollment(enrollment);
							setAttemptingSave(true);
						}}
						loading={saveLoading || attemptingSave}
						error={error || saveError}
						enrollment={enrollment}
						success={saveData && !saveError}
					/>
				</ErrorBoundary>
			</div>
		</CommonContainer>
	);
}
