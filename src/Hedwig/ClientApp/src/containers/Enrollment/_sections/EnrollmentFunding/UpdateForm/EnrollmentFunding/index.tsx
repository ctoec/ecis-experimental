import React, { useContext } from 'react';
import {
	ApiOrganizationsIdGetRequest,
	Organization,
	Enrollment,
} from '../../../../../../generated';
import UserContext from '../../../../../../contexts/User/UserContext';
import { getIdForUser } from '../../../../../../utils/models';
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
			{(mutatedEnrollment.fundings || []).map((funding, i, fundingsArr) => (
				<FundingCard
					key={`${funding.id}-funding`}
					className={i === fundingsArr.length - 1 ? 'margin-bottom-3' : ''}
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
							{(pastEnrollment.fundings || []).map((pastFunding) => (
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
