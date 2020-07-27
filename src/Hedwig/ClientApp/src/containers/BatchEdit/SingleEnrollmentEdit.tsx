import React, { useState, useContext, useEffect } from 'react';
import qs from 'query-string';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { Enrollment } from '../../generated';
import { StepProps, StepList } from '@ctoec/component-library';
import { lastFirstNameFormatter } from '../../utils/stringFormatters';
import dateFormatter from '../../utils/dateFormatter';
import UserContext from '../../contexts/User/UserContext';
import { getIdForUser } from '../../utils/models';
import useApi from '../../hooks/useApi';
import { BatchEditStepProps } from './_sections/batchEditTypes';
import ChildInfo from './_sections/ChildInfo';
import FamilyInfo from './_sections/FamilyInfo';
import FamilyIncome from './_sections/FamilyIncome';
import EnrollmentFunding from './_sections/EnrollmentFunding';
import useCatchAllErrorAlert from '../../hooks/useCatchAllErrorAlert';
import {
	hasChildInfoSectionErrors,
	hasFamilyInfoSectionErrors,
	hasEnrollmentFundingSectionErrors,
	hasFamilyIncomeSectionErrors,
} from './utils';

type SingleEnrollmentEditProps = {
	enrollment: Enrollment;
	updateEnrollments: (_: Enrollment) => void;
	moveNextEnrollment: () => void;
};

export const SingleEnrollmentEdit: React.FC<SingleEnrollmentEditProps> = ({
	enrollment,
	updateEnrollments,
	moveNextEnrollment,
}) => {
	const { user } = useContext(UserContext);
	const orgId = getIdForUser(user, 'org');

	const params = {
		orgId,
		siteId: enrollment.siteId,
		id: enrollment.id,
	};
	const history = useHistory();
	const [mutatedEnrollment, setMutatedEnrollment] = useState<Enrollment>(enrollment);

	// Create steps for step list based on state of missing/needed information
	// in the fetched enrollment. Do this only on initial render to persist
	// all steps even as the enrollment is updated & errors are resolved
	const [steps, setSteps] = useState<StepProps<BatchEditStepProps>[]>([]);

	useEffect(() => {
		const _steps: StepProps<BatchEditStepProps>[] = [];
		if (hasChildInfoSectionErrors(enrollment)) {
			_steps.push(ChildInfo);
		}
		if (hasFamilyInfoSectionErrors(enrollment)) {
			_steps.push(FamilyInfo);
		}
		if (hasFamilyIncomeSectionErrors(enrollment)) {
			_steps.push(FamilyIncome);
		}
		if (hasEnrollmentFundingSectionErrors(enrollment)) {
			_steps.push(EnrollmentFunding);
		}

		setSteps(_steps);
	}, []);

	useEffect(() => {
		const firstStep = steps.length ? steps[0].key : 'complete';
		const queryString = qs.parse(history.location.search);
		queryString['enrollmentId'] = `${mutatedEnrollment.id}`;
		history.push({
			pathname: history.location.pathname,
			search: qs.stringify(queryString),
			hash: `${firstStep}`,
		});
	}, [enrollment.id, steps]);

	// set up function to advance to next step.
	// If there is no next step for this enrollment,
	// then invoke the moveNextEnrollment function
	const locationHash = history.location.hash;
	const activeStepId = locationHash
		? locationHash.slice(1)
		: steps.length
		? steps[0].key
		: 'complete';
	const moveNextStep = () => {
		const currentIndex = steps.findIndex((step) => step.key === activeStepId);
		if (currentIndex === steps.length - 1) {
			moveNextEnrollment();
			return;
		}

		history.push({
			pathname: history.location.pathname,
			search: history.location.search,
			hash: `${steps[currentIndex + 1].key}`,
		});
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
				setMutatedEnrollment(returnedEnrollment);
				updateEnrollments(returnedEnrollment);
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
					<Link
						to={`/roster/sites/${mutatedEnrollment.siteId}/enrollments/${mutatedEnrollment.id}`}
					>
						View full profile
					</Link>
				</div>
			</div>
			<div className="padding-top-1 border-top-1px border-base-light">
				{steps.length > 0 ? (
					<StepList
						key={`${mutatedEnrollment.id}`}
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
