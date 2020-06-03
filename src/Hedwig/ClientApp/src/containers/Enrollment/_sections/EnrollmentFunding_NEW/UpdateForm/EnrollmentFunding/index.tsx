import React, { useState, useContext } from 'react';
import { SectionProps } from '../../../../enrollmentTypes';
import { Enrollment, ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest, ApiOrganizationsIdGetRequest, Organization } from '../../../../../../generated';
import UserContext from '../../../../../../contexts/User/UserContext';
import { getIdForUser, validatePermissions, fundingStartSorter, reportingPeriodFormatter } from '../../../../../../utils/models';
import useApi from '../../../../../../hooks/useApi';
import useCatchAllErrorAlert from '../../../../../../hooks/useCatchAllErrorAlert';
import { EnrollmentCard } from './EnrollmentCard';
import { FundingFormForCard } from './EnrollmentCard/FundingFormForCard';

// TODO rename to EnrollmentFundingForm, display in some other UpdateForm when enrollment/funding tab button is clicked 
// (along with Care 4 Kids section displayed when other tab button is clicked)
export const EnrollmentFundingForm = ({enrollment, siteId}: SectionProps) => {
	if (!enrollment) {
		throw new Error('Section rendered without enrollment');
	}	

	const [forceCloseEditForms, setForceCloseEditForms] = useState(false);

	const [mutatedEnrollment, setMutatedEnrollment] = useState<Enrollment>(enrollment);
	
	const [attemptingSave, setAttemptingSave] = useState(false);
	const { user } = useContext(UserContext);
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

	if(organizationLoading || !organization) {
		return <>Loading...</>;
	}

	if(organizationError) {
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
			<EnrollmentCard
				enrollment={mutatedEnrollment}
				isCurrent
				forceClose={forceCloseEditForms}
				fundingSpaces={fundingSpaces}
			>
				{(enrollment.fundings || []).map(funding => (
						<div> {/* section without border */}
							<div>
								<p>{funding.source}</p>
								<p>{reportingPeriodFormatter(funding.firstReportingPeriod)}</p>
								 <FundingFormForCard
									fundingId={funding.id}
									formData={enrollment}
									fundingSpaces={fundingSpaces}
									onSubmit={() => console.log("SUBMIT FUNDING")}
								/>
							</div>
							{/* Formatted funding content */}
							{/* If current enrollment:
								<expand section>
									{ edit button }
								</expand section>
							*/}
							{/*  If current enrollment:
								<section expand>
									<funding form>
								</section expand>	
							*/}
						</div>
					))}
			</EnrollmentCard>

			{(enrollment.pastEnrollments || []).map(pastEnrollment => 
				<EnrollmentCard
					enrollment={pastEnrollment}
					isCurrent={false}
				>
					{(pastEnrollment.fundings || []).map(funding => (
						<div> {/* section without border */}
							<div>
								<p>{funding.source}</p>
								<p>{reportingPeriodFormatter(funding.firstReportingPeriod)}</p>
								 {/* <FundingFormForCard
									fundingId={funding.id}
									formData={enrollment}
									fundingSpaces={fundingSpaces}
									onSubmit={() => console.log("SUBMIT FUNDING")}
								/> */}
							</div>
							{/* Formatted funding content */}
							{/* If current enrollment:
								<expand section>
									{ edit button }
								</expand section>
							*/}
							{/*  If current enrollment:
								<section expand>
									<funding form>
								</section expand>	
							*/}
						</div>
					))}
				</EnrollmentCard>
			)}

		</>
	)
}
