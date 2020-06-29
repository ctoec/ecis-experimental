import React, { useContext, useState, useEffect } from 'react';
import {
	getIdForUser,
	validatePermissions,
	createNewEnrollmentFromEnrollment,
	prettyAge,
	prettyFundingSpaceTime,
} from '../../../../../../utils/models';
import UserContext from '../../../../../../contexts/User/UserContext';
import useApi, { ApiError } from '../../../../../../hooks/useApi';
import { Enrollment, Site, FundingSpace, Funding } from '../../../../../../generated';
import { Form, FormSubmitButton } from '../../../../../../components/Form_New';
import { EnrollmentStartDateField } from '../../Fields/EnrollmentStartDate';
import { AgeGroupField } from '../../Fields/AgeGroup';
import { SiteField } from '../../Fields/Site';
import { FundingField } from '../../Fields/Funding';
import { Button } from '../../../../../../components';
import { ExpandCard } from '../../../../../../components/Card/ExpandCard';
import { EnrollmentEndDateField } from '../../Fields/EnrollmentEndDate';
import { LastReportingPeriodField } from '../../Fields/Funding/LastReportingPeriod';
import { FormProvider } from '../../../../../../components/Form_New/FormContext';
import { ObjectDriller } from '../../../../../../components/Form_New/ObjectDriller';
import { ErrorAlertState } from '../../../../../../hooks/useCatchAllErrorAlert';
import { useHistory } from 'react-router';

type NewEnrollmentFundingFormForCardProps = {
	currentEnrollment: Enrollment;
	setCurrentEnrollment: React.Dispatch<React.SetStateAction<Enrollment>>;
	attemptCurrentEnrollmentSave: () => void;
	currentEnrollmentSaveError: ApiError | null;
	currentEnrollmentErrorAlertState: ErrorAlertState;
	sites: Site[];
	fundingSpaces: FundingSpace[];
};

export const NewEnrollmentFundingFormForCard: React.FC<NewEnrollmentFundingFormForCardProps> = ({
	currentEnrollment,
	setCurrentEnrollment,
	attemptCurrentEnrollmentSave,
	currentEnrollmentSaveError,
	currentEnrollmentErrorAlertState,
	sites,
	fundingSpaces,
}) => {
	const { user } = useContext(UserContext);
	const [newEnrollment, setNewEnrollment] = useState(
		createNewEnrollmentFromEnrollment(currentEnrollment)
	);
	const siteId = newEnrollment.siteId;

	const history = useHistory();
	// set up the POST request to create new enrollment
	const [attemptingSave, setAttemptingSave] = useState(false);
	const params = {
		orgId: getIdForUser(user, 'org'),
		siteId: validatePermissions(user, 'site', siteId) ? siteId : 0,
		enrollment: {
			...newEnrollment,
			child: undefined,
		},
	};
	const { error: newSaveError } = useApi<Enrollment>(
		(api) => api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsPost(params),
		{
			skip: !user || !attemptingSave,
			callback: () => setAttemptingSave(false),
			successCallback: (returnedEnrollment) => {
				history.replace(
					`/roster/sites/${siteId}/enrollments/${returnedEnrollment.id}/update/enrollment-funding#enrollment-funding`
				);
			},
		}
	);

	const [newEnrollmentStartDate, setNewEnrollmentStartDate] = useState<Date>(new Date());
	const [
		newEnrollmentFundingFirstReportingPeriodId,
		setNewEnrollmentFundingFirstReportingPeriodId,
	] = useState<number>();

	// Set current funding with a first-time-render-only useEffect
	// since we rely on the  missing lastReportingPeriod predicate to find it,
	// but then update the lastReportingPeriod to have a value
	const [currentFunding, setCurrentFunding] = useState<Funding>();
	useEffect(() => {
		const [_currentFunding] = (currentEnrollment.fundings || []).filter(
			(funding) => !funding.lastReportingPeriodId
		);
		setCurrentFunding(_currentFunding);
	}, []);

	return (
		<>
			{/* New enrollment */}
			<Form<Enrollment>
				className="usa-form"
				data={newEnrollment}
				onSubmit={(userModifiedNewEnrollment) => {
					attemptCurrentEnrollmentSave();
					setNewEnrollment(userModifiedNewEnrollment);
					setAttemptingSave(true);
				}}
			>
				<SiteField
					sites={sites}
					error={newSaveError}
					previousEnrollmentSiteId={currentEnrollment.siteId}
				/>

				<EnrollmentStartDateField
					blockErrorDisplay={true}
					error={newSaveError}
					setExternalStartDate={setNewEnrollmentStartDate}
				/>

				<AgeGroupField blockErrorDisplay={true} error={newSaveError} />

				<span className="usa-label text-bold font-sans-lg">Funding</span>
				<FundingField
					fundingId={0}
					fundingSpaces={fundingSpaces}
					error={newSaveError}
					setExternalFirstReportingPeriod={setNewEnrollmentFundingFirstReportingPeriodId}
				/>

				{/* Embedded "form" for ending current enrollment and fundings */}
				<FormProvider
					value={{
						data: currentEnrollment,
						updateData: setCurrentEnrollment,
						dataDriller: new ObjectDriller(currentEnrollment),
					}}
				>
					{/* Not displayed to user; see EnrollmentEndDateField */}
					<EnrollmentEndDateField
						key={newEnrollmentStartDate.toTimeString()}
						newEnrollmentStartDate={newEnrollmentStartDate}
					/>
					{currentFunding && (
						<LastReportingPeriodField
							fundingId={currentFunding.id}
							label={`Last reporting period for current ${
								prettyAge(currentEnrollment.ageGroup) + ' '
							}${currentFunding.source + ' '}${
								prettyFundingSpaceTime(currentFunding.fundingSpace) + ' '
							}funding`}
							error={currentEnrollmentSaveError}
							errorAlertState={currentEnrollmentErrorAlertState}
							nextEnrollmentFundingFirstReportingPeriodId={
								newEnrollmentFundingFirstReportingPeriodId
							}
						/>
					)}
				</FormProvider>
				<ExpandCard>
					<Button text="Cancel" appearance="outline" />
				</ExpandCard>
				<FormSubmitButton text="Save" />
			</Form>
		</>
	);
};
