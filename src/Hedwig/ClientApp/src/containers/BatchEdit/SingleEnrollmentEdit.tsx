import React, { useState, useContext, useEffect } from 'react';
import { Enrollment } from '../../generated';
import { hasValidationErrors } from '../../utils/validations';
import { StepProps, Button } from '../../components';
import { lastFirstNameFormatter } from '../../utils/stringFormatters';
import dateFormatter from '../../utils/dateFormatter';
import StepList from '../../components/StepList/StepList';
import UserContext from '../../contexts/User/UserContext';
import { getIdForUser, enrollmentWithDefaultFamily } from '../../utils/models';
import useApi from '../../hooks/useApi';
import ChildInfo from './_sections/ChildInfo';
import { BatchEditStepProps } from './_sections/batchEditTypes';
import FamilyInfo from './_sections/FamilyInfo';
import { useHistory } from 'react-router';
import FamilyIncome from './_sections/FamilyIncome';

type SingleEnrollmentEditProps = {
	enrollmentId: number;
	siteId: number;
	moveNextEnrollment: () => void;
};

export const SingleEnrollmentEdit: React.FC<SingleEnrollmentEditProps> = ({
	enrollmentId,
	siteId,
	moveNextEnrollment,
}) => {
	const { user } = useContext(UserContext);
	const orgId = getIdForUser(user, 'org');

	const params = {
		orgId,
		siteId: siteId,
		id: enrollmentId,
	};
	const history = useHistory();
	const [mutatedEnrollment, setMutatedEnrollment] = useState<Enrollment>();

	// populate mutatedEnrollment (better name: to-be-mutated-enrollment) with enrollment detail from backend
	const { data: enrollmentDetail } = useApi<Enrollment>(
		(api) => api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGet(params),
		{
			successCallback: (returnedEnrollment) => {
				setMutatedEnrollment(
					returnedEnrollment.child?.family
						? returnedEnrollment
						: enrollmentWithDefaultFamily(returnedEnrollment, orgId)
				);
			},
			skip: !user,
			deps: [enrollmentId],
		}
	);

	// Create steps for step list, based on state of missing/needed information
	// in the fetched enrollment
	const steps: StepProps<BatchEditStepProps>[] = [];
	if ((hasValidationErrors(enrollmentDetail?.child), undefined, true) /*skip subobj validation*/) {
		steps.push(ChildInfo);
	}
	if (hasValidationErrors(enrollmentDetail?.child?.family, undefined, true)) {
		steps.push(FamilyInfo);
	}
	if (hasValidationErrors(enrollmentDetail?.child?.family, ['determinations'])) {
		steps.push(FamilyIncome);
	}

	// Set url path for initial step
	const firstStep = steps.length ? steps[0].key : 'complete';
	useEffect(() => {
		let path = '';
		const pathIdMatch = history.location.pathname.match(/(\d+)/);
		if (!pathIdMatch || pathIdMatch[0] !== `${enrollmentId}`) {
			path += `/batch-edit/${enrollmentId}`;
		}

		path += `#${firstStep}`;
		history.push(path);
	}, [enrollmentDetail]);

	// set up function to advance to next step.
	// If there is no next step for this enrollment,
	// then invoke the moveNextEnrollment function
	const locationHash = history.location.hash;
	const activeStepId = locationHash ? locationHash.slice(1) : firstStep;
	const moveNextStep = () => {
		const currentIndex = steps.findIndex((step) => step.key === activeStepId);
		if (currentIndex === steps.length - 1) {
			moveNextEnrollment();
			return;
		}

		history.push(`#${steps[currentIndex + 1].key}`);
	};

	// Set up PUT request, to be triggered by steplist forms
	const [attemptingSave, setAttemptingSave] = useState(false);
	const { error: errorOnSave } = useApi<Enrollment>(
		(api) =>
			api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPut({
				...params,
				enrollment: mutatedEnrollment,
			}),
		{
			skip: !user || !attemptingSave,
			callback: () => setAttemptingSave(false),
			successCallback: (returnedEnrollment) => {
				setAttemptingSave(false);
				setMutatedEnrollment(returnedEnrollment);
				moveNextStep();
			},
		}
	);

	if (!mutatedEnrollment) {
		return <></>;
	}

	const stepProps: BatchEditStepProps = {
		enrollment: mutatedEnrollment,
		error: errorOnSave,
		onSubmit: (userModifiedEnrollment) => {
			setMutatedEnrollment(userModifiedEnrollment);
			setAttemptingSave(true);
		},
		onSkip: moveNextStep,
	};

	return (
		<>
			<div className="grid-row flex-first-baseline flex-space-between padding-x-2 padding-bottom-3">
				<div>
					<h2>{lastFirstNameFormatter(mutatedEnrollment.child)}</h2>
					<Button
						appearance="unstyled"
						text="View full profile"
						href={`/roster/sites/${siteId}/enrollments/${enrollmentId}`}
					/>
				</div>
				<span>Date of Birth: {dateFormatter(mutatedEnrollment.child?.birthdate)}</span>
			</div>
			<div className="padding-top-4 padding-x-2 border-top-1px border-base-light">
				<StepList
					key={mutatedEnrollment.id}
					steps={steps}
					props={stepProps}
					activeStep={activeStepId}
					type="embedded"
				/>
			</div>
		</>
	);
};
