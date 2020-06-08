import React, { useState, useContext } from 'react';
import { SectionProps } from '../../../../enrollmentTypes';
import { Enrollment, ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest, ApiOrganizationsIdGetRequest, Organization } from '../../../../../../generated';
import UserContext from '../../../../../../contexts/User/UserContext';
import { getIdForUser, validatePermissions, fundingStartSorter, reportingPeriodFormatter } from '../../../../../../utils/models';
import useApi from '../../../../../../hooks/useApi';
import useCatchAllErrorAlert from '../../../../../../hooks/useCatchAllErrorAlert';
import { EnrollmentCard } from './EnrollmentCard';
import { FundingFormForCard } from './EnrollmentCard/FundingFormForCard';
import { FundingCard } from './FundingCard';
import { EnrollmentFormForCard } from './EnrollmentFormForCard';

// TODO rename to EnrollmentFundingForm, display in some other UpdateForm when enrollment/funding tab button is clicked 
// (along with Care 4 Kids section displayed when other tab button is clicked)
export const EnrollmentFundingForm = ({ enrollment, siteId }: SectionProps) => {
	if (!enrollment) {
		throw new Error('Section rendered without enrollment');
	}

	const [forceCloseEditForms, setForceCloseEditForms] = useState(false);

	const [mutatedEnrollment, setMutatedEnrollment] = useState<Enrollment>(enrollment);

	const [attemptingSave, setAttemptingSave] = useState(false);
	const { user } = useContext(UserContext);
	// this PUT should be extracted to the parent UpdateForm, and the attemptedSave/mutatedEnrollment state variables passed down into EnrollmentFundingForm and Care4Kids form (instead of their current props which are just SectionProps)
	const putParams: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest = {
		id: enrollment.id,
		siteId: validatePermissions(user, 'site', siteId) ? siteId : 0,
		orgId: getIdForUser(user, 'org'),
		enrollment: mutatedEnrollment
	};

	const { error: saveError, loading: isSaving, data: returnedEnrollment } = useApi<Enrollment>(
		(api) => api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPut(putParams),
		{
			skip: !user || !attemptingSave,
			callback: () => {
				setAttemptingSave(false);
			},
		}
	);
	useCatchAllErrorAlert(saveError);

	const params: ApiOrganizationsIdGetRequest = {
		id: getIdForUser(user, 'org'),
		include: ['enrollments', 'fundings', 'funding_spaces']
	}

	const { data: organization, error: organizationError, loading: organizationLoading } = useApi<Organization>(
		(api) => api.apiOrganizationsIdGet(params),
		{
			skip: !user,
		}
	);

	if (organizationLoading || !organization) {
		return <>Loading...</>;
	}

	if (organizationError) {
		return <>Something went wrong!</>
	}

	const fundingSpaces = organization.fundingSpaces || [];

	const formOnSubmit = (_data: Enrollment) => {
		setMutatedEnrollment(_data);
		setAttemptingSave(true);
		setForceCloseEditForms(true);
	}

	return (
		<>
			<h2>Current enrollment</h2>
			<EnrollmentCard
				enrollment={mutatedEnrollment}
				isCurrent
				forceClose={forceCloseEditForms}
				expansion={
					<EnrollmentFormForCard
						formData={enrollment}
						onSubmit={formOnSubmit}
					/>
				}
			/>
			{(enrollment.fundings || []).map(funding => (
				<FundingCard
					funding={funding}
					isCurrent
					forceClose={forceCloseEditForms}
					expansion={
						<FundingFormForCard
							fundingId={funding.id}
							fundingSpaces={fundingSpaces}
							formData={enrollment}
							onSubmit={formOnSubmit}
						/>
					}
				/>
			))}

			<h2>Past enrollments</h2>
			{(enrollment.pastEnrollments || []).map(pastEnrollment =>
				<>
					<EnrollmentCard
						enrollment={pastEnrollment}
						isCurrent={false}
					/>
					{(pastEnrollment.fundings || []).map(pastFunding => (
						<FundingCard
							funding={pastFunding}
							isCurrent={false}
							forceClose={forceCloseEditForms}
						/>
					))}
				</>
			)}
		</>
	)
}
