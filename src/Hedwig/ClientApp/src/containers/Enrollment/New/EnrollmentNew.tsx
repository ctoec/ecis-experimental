import React, { useContext, useState } from 'react';
import { History } from 'history';
import { Section, SectionProps } from '../enrollmentTypes';
import { default as StepList, StepProps } from '../../../components/StepList/StepList';
import ChildInfo from '../_sections/ChildInfo';
import FamilyInfo from '../_sections/FamilyInfo';
import FamilyIncome from '../_sections/FamilyIncome';
import EnrollmentFunding from '../_sections/EnrollmentFunding';
import { Button } from '../../../components';
import useApi from '../../../hooks/useApi';
import UserContext from '../../../contexts/User/UserContext';
import {
	Enrollment,
	ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGetRequest,
	ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdDeleteRequest,
} from '../../../generated';
import { validatePermissions, getIdForUser } from '../../../utils/models';
import CommonContainer from '../../CommonContainer';
import { hasValidationErrors } from '../../../utils/validations';
import AlertContext from '../../../contexts/Alert/AlertContext';
import nameFormatter from '../../../utils/nameFormatter';

type EnrollmentNewParams = {
	history: History;
	match: {
		params: {
			siteId: number;
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
	const { user } = useContext(UserContext);
	const { setAlerts } = useContext(AlertContext);

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

	const [cancel, updateCancel] = useState(false);
	const processSuccessfulCancel = () => {
		setAlerts([
			{
				type: 'info',
				heading: 'Cancelled enrollment',
				text: 'Successfully cancelled enrollment',
			},
		]);
		history.push('/roster');
	}
	const cancelParams: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdDeleteRequest = {
		id: enrollmentId ? enrollmentId : 0,
		orgId: getIdForUser(user, 'org'),
		siteId: validatePermissions(user, 'site', siteId) ? siteId : 0,
		enrollment: enrollment
	};
	const [, cancelError] = useApi(
		api => api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdDelete(cancelParams),
		[enrollmentId, enrollment, user, cancel],
		{
			skip: !cancel,
			callback: processSuccessfulCancel
		}
	);
	

	const [visitedSections, updateVisitedSections] = useState(mapSectionToVisitedStates(sections));

	const visitSection = (section: Section) => {
		updateVisitedSections({
			...visitedSections,
			[section.key]: true
		});
	}

	if (cancelError) {
		// TODO: do something with this error
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
			history.replace(`/roster/sites/${siteId}/enrollments/${enrollment.id}/new/${sectionId}`);
		}

		const currentIndex = sections.findIndex(section => section.key === sectionId);

		// If we're on the last section, we'll move to a final 'review' section where all
		// steps are collapsed and we can 'Finish' the enrollment.
		if (currentIndex === sections.length - 1) {
			history.push(`/roster/sites/${siteId}/enrollments/${enrollment.id}/new/review`);
		} else {
			const nextSectionId = sections[currentIndex + 1].key;
			history.push(`/roster/sites/${siteId}/enrollments/${enrollment.id}/new/${nextSectionId}`);
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
			<div className="grid-container">
				<h1>Enroll child</h1>
				<div className="margin-top-2 margin-bottom-5">
					<StepList steps={steps} activeStep={sectionId} props={props} />
				</div>
				<div className="grid-row flex-first-baseline flex-space-between">
					<Button
						text="Cancel"
						appearance='outline'
						onClick={() => {
							var response = window.confirm("Are you sure you want to cancel? All information entered for this enrollment will be lost.");
							if (response) {
								if (enrollment) {
									updateCancel(true);
								} else {
									processSuccessfulCancel();
								}
							}
						}}
					/>
					{sectionId === 'review' && 
						<Button
							className="margin-right-0"
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
					}
				</div>
			</div>
		</CommonContainer>
	);
}
