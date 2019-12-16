import React, { useContext } from 'react';
import { Section } from '../enrollmentTypes';
import { History } from 'history';
import ChildInfo from '../_sections/ChildInfo';
import FamilyInfo from '../_sections/FamilyInfo';
import FamilyIncome from '../_sections/FamilyIncome';
import EnrollmentFunding from '../_sections/EnrollmentFunding';
import PageNotFound from '../../PageNotFound/PageNotFound';
import UserContext from '../../../contexts/User/UserContext';
import { Enrollment, ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGetRequest } from '../../../generated';
import getIdForUser from '../../../utils/getIdForUser';
import useApi from '../../../hooks/useApi';
import { DeepNonUndefineable } from '../../../utils/types';

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
		params: { enrollmentId, sectionId },
	},
}: EnrollmentEditParams) {
	const section = sections[sectionId];
	const { user } = useContext(UserContext);

	// Get enrollment by id
	const params: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGetRequest = {
		id: enrollmentId  ? enrollmentId : 0,
		orgId: getIdForUser(user, "org"),
		siteId: getIdForUser(user, "site"),
		include: ['child', 'family', 'determinations', 'fundings']
	}
	const [loading, error, enrollment, mutate] = useApi(
		(api) => api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGet(params),
		[user]
	);

	if (!section) {
		return <PageNotFound />;
	}

	if (loading || error || !enrollment ) {
		return <div className="EnrollmentEdit"></div>;
	}

	/**
	 * Accepts an enrollment and navigates back to the enrollment
	 * summary page.
	 * 
	 * @param enrollment Enrollment that was just saved.
	 */
	const afterSave = (enrollment: Enrollment) => {
		history.push(`/roster/enrollments/${enrollment.id}/`);
	};

	return (
		<div className="EnrollmentEdit">
			<section className="grid-container">
				<h1>Edit {section.name.toLowerCase()}</h1>
				<section.Form enrollment={enrollment} mutate={mutate} callback={afterSave} />
			</section>
		</div>
	);
}
