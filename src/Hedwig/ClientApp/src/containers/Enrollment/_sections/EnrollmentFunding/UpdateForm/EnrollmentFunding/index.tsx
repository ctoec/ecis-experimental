import React, { useContext } from 'react';
import { ApiOrganizationsIdGetRequest, Organization } from '../../../../../../generated';
import UserContext from '../../../../../../contexts/User/UserContext';
import { getIdForUser } from '../../../../../../utils/models';
import useApi from '../../../../../../hooks/useApi';
import useCatchAllErrorAlert from '../../../../../../hooks/useCatchAllErrorAlert';
import { EnrollmentCard } from './EnrollmentCard';
import { FundingFormForCard } from './FundingFormForCard';
import { FundingCard } from './FundingCard';
import { EnrollmentFormForCard } from './EnrollmentFormForCard';
import { UpdateFormSectionProps } from '../common';

export const EnrollmentFundingForm: React.FC<UpdateFormSectionProps> = ({
	mutatedEnrollment,
	formOnSubmit,
	saveError,
	errorAlertState,
	forceCloseEditForms,
}) => {
	const { user } = useContext(UserContext);

	const params: ApiOrganizationsIdGetRequest = {
		id: getIdForUser(user, 'org'),
		include: ['enrollments', 'fundings', 'funding_spaces'],
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

	const pastEnrollments = mutatedEnrollment.pastEnrollments || [];
	return (
		<>
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
