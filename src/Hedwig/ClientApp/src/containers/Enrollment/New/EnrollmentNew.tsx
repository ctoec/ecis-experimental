import React, { useContext } from 'react';
import useAuthQuery from '../../../hooks/useAuthQuery';
import { History } from 'history';
import { Section, SectionProps } from '../enrollmentTypes';
import { default as StepList, StepProps } from '../../../components/StepList/StepList';
import { CHILD_QUERY } from '../enrollmentQueries';
import { ChildQuery, ChildQuery_child } from '../../../generated/ChildQuery';
import ChildInfo from '../_sections/ChildInfo';
import FamilyInfo from '../_sections/FamilyInfo';
import FamilyIncome from '../_sections/FamilyIncome';
import EnrollmentFunding from '../_sections/EnrollmentFunding';
import Button from '../../../components/Button/Button';
import useOASClient from '../../../hooks/useOASClient';
import UserContext from '../../../contexts/User/UserContext';
import { Enrollment, ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGetRequest } from '../../../OAS-generated';

type EnrollmentNewParams = {
	history: History;
	match: {
		params: {
			siteId?: string;
			enrollmentId?: number;
			sectionId?: string;
		};
	};
};

// const sections = [ChildInfo, FamilyInfo, FamilyIncome, EnrollmentFunding];
const sections = [ChildInfo, FamilyIncome, EnrollmentFunding];

const mapSectionsToSteps = (sections: Section[]) => {
	const steps: StepProps<SectionProps>[] = sections.map(section => {
		const editPath = section.key;
		return { ...section, editPath };
	});
	return steps;
};

export default function EnrollmentNew({
	history,
	match: {
		params: { siteId, enrollmentId, sectionId = ChildInfo.key },
	},
}: EnrollmentNewParams) {
	const { user } = useContext(UserContext);
	if (!siteId && !enrollmentId) {
		throw new Error('EnrollmentNew rendered without siteId or childId parameters');
	}

	// get child if have child
	// const { loading, error, data } = useAuthQuery<ChildQuery>(CHILD_QUERY, {
	// 	variables: { id: childId },
	// 	skip: !childId,
	// });
	const { data } = useOASClient<ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGetRequest, Enrollment>('apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGet', {
		id: enrollmentId ? enrollmentId : 0,
		orgId: (user && user.orgPermissions && user.orgPermissions[0] && user.orgPermissions[0].organizationId) || 1,
		siteId: (user && user.sitePermissions && user.sitePermissions[0] && user.sitePermissions[0].siteId) || 1,
		include: ['child', 'family', 'determinations', 'fundings']
	});


	// if (!data) {
	// 	return <div className="EnrollmentNew"></div>;
	// }

	const enrollment = data;

	const afterSave = (enrollment: Enrollment) => {
		// Enrollments begin at /roster/sites/:siteId/enroll. We replace this URL in the
		// browser history once we have an ID for the child.
		if (!enrollmentId) {
			history.replace(`/roster/enrollments/${enrollment.id}/new/${sectionId}`);
		}

		const currentIndex = sections.findIndex(section => section.key === sectionId);

		// If we're on the last section, we'll move to a final 'review' section where all
		// steps are collapsed and we can 'Finish' the enrollment.
		if (currentIndex === sections.length - 1) {
			history.push(`/roster/enrollments/${enrollment.id}/new/review`);
		} else {
			const nextSectionId = sections[currentIndex + 1].key;
			history.push(`/roster/enrollments/${enrollment.id}/new/${nextSectionId}`);
		}
	};

	const steps = mapSectionsToSteps(sections);

	const props: SectionProps = {
		enrollment: enrollment,
		siteId,
		afterSave,
	};

	return (
		<div className="EnrollmentNew">
			<section className="grid-container">
				<h1>Enroll child</h1>
				<div className="margin-top-2 margin-bottom-5">
					<StepList steps={steps} activeStep={sectionId} props={props} />
				</div>
				{sectionId === 'review' && <Button href="../" text="Finish" />}
			</section>
		</div>
	);
}
