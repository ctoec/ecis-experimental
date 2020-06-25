import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router';
import { Enrollment } from '../../generated';
import { hasValidationErrors } from '../../utils/validations';
import { StepProps, Button, StepList } from '../../components';
import { lastFirstNameFormatter } from '../../utils/stringFormatters';
import dateFormatter from '../../utils/dateFormatter';
import UserContext from '../../contexts/User/UserContext';
import { getIdForUser, enrollmentWithDefaultFamily } from '../../utils/models';
import useApi from '../../hooks/useApi';
import { BatchEditStepProps } from './_sections/batchEditTypes';
import ChildInfo from './_sections/ChildInfo';
import FamilyInfo from './_sections/FamilyInfo';
import FamilyIncome from './_sections/FamilyIncome';
import EnrollmentFunding from './_sections/EnrollmentFunding';
import useCatchAllErrorAlert from '../../hooks/useCatchAllErrorAlert';
import { Link } from 'react-router-dom';

type SingleEnrollmentEditProps = {
	enrollment: Enrollment;
	updateEnrollments: (_: Enrollment) => void;
	siteId: number;
	moveNextEnrollment: () => void;
};

export const SingleEnrollmentEdit: React.FC<SingleEnrollmentEditProps> = ({
	enrollment,
	updateEnrollments,
	siteId,
	moveNextEnrollment,
}) => {
	const { user } = useContext(UserContext);
	const orgId = getIdForUser(user, 'org');

	const params = {
		orgId,
		siteId: siteId,
		id: enrollment.id,
	};
	const history = useHistory();
	const [mutatedEnrollment, setMutatedEnrollment] = useState<Enrollment>(enrollment);

	// Update the list of enrollments in parent EnrollmentsEditList
	// to have the most current version of this single enrollment
	useEffect(() => {
		if (mutatedEnrollment) {
			updateEnrollments(mutatedEnrollment);
		}
	}, [mutatedEnrollment]);

	// Create steps for step list, based on state of missing/needed information
	// in the fetched enrollment
	const steps: StepProps<BatchEditStepProps>[] = [];
	if (hasValidationErrors(mutatedEnrollment?.child, undefined, true) /*skip subobj validation*/) {
		steps.push(ChildInfo);
	}
	if (hasValidationErrors(mutatedEnrollment?.child?.family, undefined, true)) {
		steps.push(FamilyInfo);
	}
	if (hasValidationErrors(mutatedEnrollment?.child?.family, ['determinations'])) {
		steps.push(FamilyIncome);
	}
	if (
		hasValidationErrors(mutatedEnrollment, ['entry']) ||
		hasValidationErrors(mutatedEnrollment?.child, ['c4KCertificateFamilyId', 'c4KCertificates'])
	) {
		steps.push(EnrollmentFunding);
	}

	// Set url path for initial step
	const firstStep = steps.length ? steps[0].key : 'complete';
	useEffect(() => {
		let path = '';
		const pathIdMatch = history.location.pathname.match(/(\d+)/);
		if (!pathIdMatch || pathIdMatch[0] !== `${mutatedEnrollment.id}`) {
			path += `/batch-edit/${mutatedEnrollment.id}`;
		}

		path += `#${firstStep}`;
		history.push(path);
	}, [mutatedEnrollment]);

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
	const errorAlertState = useCatchAllErrorAlert(errorOnSave);

	if (!enrollment || !mutatedEnrollment) {
		return <></>;
	}

	const stepProps: BatchEditStepProps = {
		enrollment: mutatedEnrollment,
		error: errorOnSave,
		errorAlertState,
		onSubmit: (userModifiedEnrollment) => {
			setMutatedEnrollment(userModifiedEnrollment);
			setAttemptingSave(true);
		},
		onSkip: moveNextStep,
	};

	return (
		<>
			<div className="padding-x-2 padding-bottom-3">
				<div className="flex-row display-flex flex-justify flex-align-end">
					<h2>{lastFirstNameFormatter(mutatedEnrollment.child)}</h2>
					<div className="text-baseline">
						Date of Birth: {dateFormatter(mutatedEnrollment.child?.birthdate)}
					</div>
				</div>
				<div className="margin-top-1">
					<Link to={`/roster/sites/${siteId}/enrollments/${mutatedEnrollment.id}`}>View full profile</Link>
				</div>
			</div>
			<div className="padding-top-1 border-top-1px border-base-light">
				{steps.length > 0 ? (
					<StepList
						key={mutatedEnrollment.id}
						steps={steps}
						props={stepProps}
						activeStep={activeStepId}
						type="embedded"
						headerLevel="h3"
					/>
				) : (
						<div className="margin-y-2 display-flex flex-center">All complete!</div>
					)}
			</div>
		</>
	);
};
