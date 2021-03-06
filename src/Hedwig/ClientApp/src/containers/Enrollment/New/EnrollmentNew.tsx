import React, { useContext, useEffect, useState, useCallback } from 'react';
import { History } from 'history';
import { Section, SectionProps, headerLevels } from '../enrollmentTypes';
import { default as StepList, StepProps } from '../../../components/StepList/StepList';
import ChildInfo from '../_sections/ChildInfo';
import FamilyInfo from '../_sections/FamilyInfo';
import FamilyIncome from '../_sections/FamilyIncome';
import EnrollmentFunding from '../_sections/EnrollmentFunding';
import { Button, ErrorBoundary, Alert } from '../../../components';
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
import {
	nameFormatter,
	newEnrollentMissingInfoAlert,
	newEnrollmentCompleteAlert,
	stepListSaveFailAlert,
} from '../../../utils/stringFormatters';
import useRouteChange from '../../../hooks/useRouteChange';
import { somethingWentWrongAlert } from '../../../utils/stringFormatters/alertTextMakers';

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
	const steps: StepProps<SectionProps>[] = sections.map((section) => {
		const editPath = section.key;
		return { ...section, editPath };
	});
	return steps;
};

const mapSectionToTouchedSectionStates = (sections: Section[]) => {
	return sections.reduce<{ [key: string]: boolean }>(
		(acc, section) => ({
			...acc,
			[section.key]: false,
		}),
		{}
	);
};

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

	const [touchedSections, updateTouchedSections] = useState({
		...mapSectionToTouchedSectionStates(sections),
		// Because two different URL paths mount the EnrollmentNew component,
		// the state is overwritten with the default of all sections touched
		// as false when moving from `/enroll/new` to `/enroll/[id]/`. Thus,
		// child info does not show validation errors until the second time
		// attempting to save. This is a work around that looks for the
		// enrollment id in the URL path. If it is found, we know we have
		// already touched the section.
		[ChildInfo.key]: !!enrollmentId,
	});

	const onSectionTouch = (section: Section) => {
		updateTouchedSections({
			...touchedSections,
			[section.key]: true,
		});
	};

	/*
		We need "navigated" because history push in save rerenders this component before useApi has a chance to
		set loading to true (and reload the enrollment with new fields, i.e. family for family income), leading to errors.
	*/
	const [navigated, setNavigated] = useState(false);

	const { loading: siteLoading, data: site } = useApi((api) =>
		api.apiOrganizationsOrgIdSitesIdGet({
			id: siteId,
			orgId: getIdForUser(user, 'org'),
		})
	);

	const [enrollment, updateEnrollment] = useState<Enrollment | null>(null);
	// Get enrollment by id
	const params: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGetRequest = {
		id: enrollmentId ? enrollmentId : 0,
		orgId: getIdForUser(user, 'org'),
		siteId: validatePermissions(user, 'site', siteId) ? siteId : 0,
	};
	const { error, data: _enrollment, loading } = useApi<Enrollment>(
		(api) =>
			api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGet({
				...params,
			}),
		{ skip: !enrollmentId || !user, deps: [sectionId], callback: () => setNavigated(false) }
	);
	useEffect(() => {
		updateEnrollment(_enrollment);
	}, [_enrollment]);

	const [cancel, updateCancel] = useState(false);
	const processSuccessfulCancel = () => {
		history.push('/roster');
	};
	const cancelParams: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdDeleteRequest = {
		id: enrollmentId ? enrollmentId : 0,
		orgId: getIdForUser(user, 'org'),
		siteId: validatePermissions(user, 'site', siteId) ? siteId : 0,
		enrollment: enrollment || undefined,
	};
	const { error: cancelError } = useApi(
		(api) => api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdDelete(cancelParams),
		{
			skip: !cancel,
			callback: processSuccessfulCancel,
		}
	);

	const scrollToTop = useCallback(() => window.scroll(0, 0), []);
	useRouteChange(scrollToTop);

	if (cancelError) {
		// TODO: do something with this error
		console.error(cancelError);
	}

	/**
	 * Accepts an enrollment and updates URL to appropriate section.
	 *
	 * @param enrollment Enrollment that was just saved
	 */
	const afterSave = (_enrollment: Enrollment) => {
		// Enrollments begin at /roster/sites/:siteId/enroll. We replace this URL in the
		// browser history once we have an ID for the child.
		if (!enrollmentId) {
			history.replace(`/roster/sites/${siteId}/enrollments/${_enrollment.id}/new/${sectionId}`);
		}

		setNavigated(true);

		const currentIndex = sections.findIndex((section) => section.key === sectionId);

		if (currentIndex === sections.length - 1) {
			// If we're on the last section, we'll move to a final 'review' section where all
			// steps are collapsed and we can 'Finish' the enrollment.
			history.push(`/roster/sites/${siteId}/enrollments/${_enrollment.id}/new/review`);
		} else {
			const nextSectionId = sections[currentIndex + 1].key;
			history.push(`/roster/sites/${siteId}/enrollments/${_enrollment.id}/new/${nextSectionId}`);
		}
	};

	if (navigated || loading || !user) {
		// Need to check for user here so that a refresh after partial enrollment doesn't crash
		// If there's an enrollmentId and not an enrollment, the get request is still loading
		return <div className="EnrollmentNew"></div>;
	}
	if (enrollmentId && !enrollment) {
		// If we are tranisitioning pages, wait for the local enrollment state to be updated
		return <div className="EnrollmentNew"></div>;
	}

	// If we are still loading, show a loading page
	if (siteLoading) {
		return <>Loading...</>;
	}

	// If we stopped loading, and still don't have these values
	// Then an error other than a validation error ocurred.
	// (In staging, it is likely that a new deployment happened.
	// This changes the ids of the objects. Thus, when a user
	// navigates back to roster 401/403 errors to occur.
	// This can be resolved with a hard refresh. We don't do that
	// because if it truly is a 500 error, we would get an infite
	// loop). For now, show a general purpose alert message.
	if (!site) {
		return <Alert {...somethingWentWrongAlert}></Alert>;
	}

	const steps = mapSectionsToSteps(sections);

	const props: SectionProps = {
		siteId,
		enrollment: enrollment,
		updateEnrollment,
		error,
		successCallback: afterSave,
		onSectionTouch,
		touchedSections,
		// Starting header level within sections is h3 because each step in the steplist uses h2
		startingHeaderLevel: headerLevels[2],
	};

	return (
		<CommonContainer>
			<div className="grid-container">
				<h1>Enroll child at {site.name}</h1>
				<div className="margin-top-2 margin-bottom-5">
					<ErrorBoundary alertProps={stepListSaveFailAlert}>
						<StepList steps={steps} activeStep={sectionId} props={props} />
					</ErrorBoundary>
				</div>
				<div className="grid-row flex-first-baseline flex-space-between">
					<Button
						text="Cancel"
						appearance="outline"
						onClick={() => {
							var response = window.confirm(
								'Are you sure you want to cancel? You will lose all information entered for this child.'
							);
							if (response) {
								if (enrollment) {
									updateCancel(true);
								} else {
									processSuccessfulCancel();
								}
							}
						}}
					/>
					{sectionId === 'review' && (
						<Button
							className="margin-right-0"
							href="../"
							text="Finish"
							onClick={() => {
								if (!enrollment) {
									return;
								}
								const childName = nameFormatter(enrollment.child);
								setAlerts([
									hasValidationErrors(enrollment)
										? newEnrollentMissingInfoAlert(childName)
										: newEnrollmentCompleteAlert(childName),
								]);
							}}
						/>
					)}
				</div>
			</div>
		</CommonContainer>
	);
}
