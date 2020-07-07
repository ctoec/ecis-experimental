import React, { useContext, useState } from 'react';
import {
	ApiOrganizationsIdGetRequest,
	Organization,
	Enrollment,
} from '../../../../../../generated';
import UserContext from '../../../../../../contexts/User/UserContext';
import { getIdForUser, prettyAge, prettyFundingSpaceTime } from '../../../../../../utils/models';
import useApi from '../../../../../../hooks/useApi';
import { EnrollmentCard } from './EnrollmentCard';
import { FundingFormForCard } from './FundingFormForCard';
import { FundingCard } from './FundingCard';
import { EnrollmentFormForCard } from './EnrollmentFormForCard';
import { UpdateFormSectionProps } from '../common';
import { Card, Button } from '../../../../../../components';
import { ExpandCard } from '../../../../../../components/Card/ExpandCard';
import { CardExpansion } from '../../../../../../components/Card/CardExpansion';
import { NewEnrollmentFundingFormForCard } from './NewEnrollmentFundingFormForCard';
import { Form, FormSubmitButton } from '../../../../../../components/Form_New';
import { propertyDateSorter } from '../../../../../../utils/dateSorter';
import { LastReportingPeriodField } from '../../Fields/Funding/LastReportingPeriod';
import { FundingField } from '../../Fields/Funding';
import cloneDeep from 'lodash/cloneDeep';
import { EndFundingFormForCard } from './EndFundingFormForCard';
import { ChangeFundingFormForCard } from './ChangeFundingFormForCard';

export const EnrollmentFundingForm: React.FC<UpdateFormSectionProps> = ({
	mutatedEnrollment,
	setMutatedEnrollment,
	attemptSave,
	saveError,
	errorAlertState,
	forceCloseEditForms,
}) => {
	const { user } = useContext(UserContext);

	const params: ApiOrganizationsIdGetRequest = {
		id: getIdForUser(user, 'org'),
	};

	const [showEndCurrent, setShowEndCurrent] = useState(false);
	const [showStartNew, setShowStartNew] = useState(false);

	const { data: organization, error: organizationError, loading: organizationLoading } = useApi<
		Organization
	>((api) => api.apiOrganizationsIdGet(params), {
		skip: !user,
	});

	if (organizationLoading || !organization) {
		return <>Loading...</>;
	}

	if (organizationError) {
		return <>Something went wrong!</>;
	}

	const fundingSpaces = organization.fundingSpaces || [];
	const sites = organization.sites || [];

	const pastEnrollments = mutatedEnrollment.pastEnrollments || [];

	// Current enrollment form on submit
	const formOnSubmit = (userModifiedCurrentEnrollment: Enrollment) => {
		setMutatedEnrollment(userModifiedCurrentEnrollment);
		attemptSave();
	};

	const sortedFundings = cloneDeep(mutatedEnrollment.fundings || []).sort((a, b) =>
		propertyDateSorter(a, b, (funding) => funding.firstReportingPeriod?.period, true)
	);

	const currentFunding =
		sortedFundings[0] && !sortedFundings[0].lastReportingPeriodId ? sortedFundings[0] : undefined;

	return (
		<>
			<Card forceClose={forceCloseEditForms}>
				<div className="display-flex flex-justify">
					<p>Has {mutatedEnrollment.child?.firstName}'s age group and/or site changed?</p>
					<ExpandCard>
						<Button text="Create new enrollment" appearance="outline" />
					</ExpandCard>
				</div>
				<CardExpansion>
					<NewEnrollmentFundingFormForCard
						currentEnrollment={mutatedEnrollment}
						setCurrentEnrollment={setMutatedEnrollment}
						attemptCurrentEnrollmentSave={attemptSave}
						currentEnrollmentErrorAlertState={errorAlertState}
						currentEnrollmentSaveError={saveError}
						sites={sites}
						fundingSpaces={fundingSpaces}
					/>
				</CardExpansion>
			</Card>

			<h2 className="font-sans-md margin-top-2 margin-bottom-2">Current enrollment</h2>
			<EnrollmentCard
				key={`${mutatedEnrollment.id}-current`}
				enrollment={mutatedEnrollment}
				isCurrent
				forceClose={forceCloseEditForms}
				expansion={
					<EnrollmentFormForCard
						formData={mutatedEnrollment}
						onSubmit={formOnSubmit}
						error={saveError}
						errorAlertState={errorAlertState}
					/>
				}
			/>
			{sortedFundings.map((funding) => (
				<FundingCard
					key={`${funding.id}-funding`}
					funding={funding}
					isCurrent
					forceClose={forceCloseEditForms}
					expansion={
						<FundingFormForCard
							fundingId={funding.id}
							fundingSpaces={fundingSpaces}
							formData={mutatedEnrollment}
							onSubmit={formOnSubmit}
							error={saveError}
							errorAlertState={errorAlertState}
						/>
					}
				/>
			))}
			{currentFunding && showEndCurrent && (
				<Card>
					<EndFundingFormForCard
						fundingId={currentFunding.id}
						formData={mutatedEnrollment}
						onSubmit={(userModifiedEnrollment) => {
							setShowEndCurrent(false);
							formOnSubmit(userModifiedEnrollment);
						}}
						onCancel={() => setShowEndCurrent(false)}
						error={saveError}
					/>
				</Card>
			)}
			{showStartNew && (
				<Card>
					<ChangeFundingFormForCard
						currentFunding={currentFunding}
						formData={mutatedEnrollment}
						fundingSpaces={fundingSpaces}
						onSubmit={(userModifiedEnrollment) => {
							setShowStartNew(false);
							formOnSubmit(userModifiedEnrollment);
						}}
						onCancel={() => setShowStartNew(false)}
						error={saveError}
					/>
				</Card>
			)}

			<Card>
				<div className="display-flex flex-column flex-align-end">
					<div>
						{currentFunding && (
							<Button
								text="End current funding"
								appearance="unstyled"
								onClick={() => {
									setShowEndCurrent(true);
									setShowStartNew(false);
								}}
							/>
						)}
						&nbsp;&nbsp;&nbsp;
						<Button
							text="Start new funding"
							appearance="unstyled"
							onClick={() => {
								setShowEndCurrent(false);
								setShowStartNew(true);
							}}
						/>
					</div>
				</div>
			</Card>

			{pastEnrollments.length > 0 && (
				<>
					<h2 className="font-sans-md margin-top-2 margin-bottom-2">Past enrollments</h2>
					{(mutatedEnrollment.pastEnrollments || []).map((pastEnrollment) => (
						<>
							<EnrollmentCard
								key={`${pastEnrollment.id}-past-enrollment`}
								enrollment={pastEnrollment}
								isCurrent={false}
							/>
							{(pastEnrollment.fundings || [])
								.sort((a, b) =>
									propertyDateSorter(a, b, (f) => f.firstReportingPeriod?.period, true)
								)
								.map((pastFunding) => (
									<FundingCard
										key={pastFunding.id}
										funding={pastFunding}
										isCurrent={false}
										forceClose={forceCloseEditForms}
									/>
								))}
						</>
					))}
				</>
			)}
		</>
	);
};
