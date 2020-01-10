import React, { useContext, useState } from 'react';
import { History } from 'history';
import { Section, SectionProps } from '../enrollmentTypes';
import { default as StepList, StepProps } from '../../../components/StepList/StepList';
import ChildInfo from '../_sections/ChildInfo';
import FamilyInfo from '../_sections/FamilyInfo';
import FamilyIncome from '../_sections/FamilyIncome';
import EnrollmentFunding from '../_sections/EnrollmentFunding';
import Button from '../../../components/Button/Button';
import useApi from '../../../hooks/useApi';
import UserContext from '../../../contexts/User/UserContext';
import {
	Enrollment,
	ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGetRequest,
} from '../../../generated';
import getIdForUser from '../../../utils/getIdForUser';
import CommonContainer from '../../CommonContainer';
import { hasValidationErrors } from '../../../utils/validations';
import AlertContext from '../../../contexts/Alert/AlertContext';
import nameFormatter from '../../../utils/nameFormatter';

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

const sections = [ChildInfo, FamilyInfo, FamilyIncome, EnrollmentFunding];

const mapSectionsToSteps = (sections: Section[]) => {
	const steps: StepProps<SectionProps>[] = sections.map(section => {
		const editPath = section.key;
		return { ...section, editPath };
	});
	return steps;
};

const mapSectionToVisitedStates = (sections: Section[]) => {
	return sections.reduce<{[key: string]: boolean}>(
		(acc, section) => ({
			...acc,
			[section.key]: false
		}),
		{}
	);
}

/**
 * React component for entering a new enrollment. This component
 * hands off to a StepList component of sections, which are included
 * in `../_sections`.
 *
 * @param props Props with location
 */
export default function EnrollmentNew({
	history,
	match: {
		params: { siteId, enrollmentId, sectionId = ChildInfo.key },
	},
}: EnrollmentNewParams) {
	if (!siteId && !enrollmentId) {
		throw new Error('EnrollmentNew rendered without siteId or enrollmentId parameters');
	}

	const { user } = useContext(UserContext);
	const { setAlerts } = useContext(AlertContext);

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

	const [visitedSections, updateVisitedSections] = useState(mapSectionToVisitedStates(sections));

	const visitSection = (section: Section) => {
		updateVisitedSections({
			...visitedSections,
			[section.key]: true
		});
	}

	/**
	 * Accepts an enrollment and updates URL to appropriate section.
	 *
	 * @param enrollment Enrollment that was just saved
	 */
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

	if (loading || error || !user) {
		// Need to add user here so that a refresh after partial enrollment doesn't crash
		return <div className="EnrollmentNew"></div>;
	}

	const steps = mapSectionsToSteps(sections);

	const props: SectionProps = {
		enrollment: enrollment,
		mutate: mutate,
		successCallback: afterSave,
		finallyCallback: visitSection,
		siteId,
		visitedSections: visitedSections
	};

	return (
		<CommonContainer>
			<section className="grid-container">
				<h1>Enroll child</h1>
				<div className="margin-top-2 margin-bottom-5">
					<StepList steps={steps} activeStep={sectionId} props={props} />
				</div>
				{sectionId === 'review' && (
					<Button
						href="../"
						text="Finish"
						onClick={() => {
							const childName = nameFormatter(enrollment.child);
							const inSiteName = enrollment.site ? ` in ${enrollment.site.name}` : '';
							let successAlertText = `${childName} has been successfully enrolled${inSiteName}.`;

							const informationIsMissing = hasValidationErrors(enrollment);
							if (informationIsMissing) {
								successAlertText +=
									' However, there is missing information you are required to enter before you can submit your monthly CDC report.';
							}

							setAlerts([
								{
									type: 'success',
									heading: 'Enrolled',
									text: successAlertText,
								},
							]);
						}}
					/>
				)}
			</section>
		</CommonContainer>
	);
}
