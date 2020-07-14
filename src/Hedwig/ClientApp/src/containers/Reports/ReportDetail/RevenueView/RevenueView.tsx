import React, { useContext } from 'react';
import {
	CdcReport,
	ApiOrganizationsOrgIdEnrollmentsGetRequest,
	FundingTime,
} from '../../../../generated';
import useApi, { ApiError } from '../../../../hooks/useApi';
import UserContext from '../../../../contexts/User/UserContext';
import { FieldSet, Alert } from '@ctoec/component-library';
import { getIdForUser, getFundingSpaces } from '../../../../utils/models';
import UtilizationTable from './UtilizationTable';
import dateFormatter from '../../../../utils/dateFormatter';
// TODO
import { FormSubmitButton } from '../../../../components/Form_New';
import { ErrorAlertState } from '../../../../hooks/useCatchAllErrorAlert';
import { TimeSplitUtilizationField, OtherRevenueFieldSet } from '../ReportSubmitFields';
import { somethingWentWrongAlert } from '../../../../utils/stringFormatters/alertTextMakers';

export type ReportSubmitFormProps = {
	report: CdcReport;
	error: ApiError | null;
	errorAlertState: ErrorAlertState | undefined;
	canSubmit: boolean;
	attemptingSave: boolean;
};

const RevenueView: React.FC<ReportSubmitFormProps> = ({
	report,
	error,
	errorAlertState,
	canSubmit,
	attemptingSave,
}) => {
	const { user } = useContext(UserContext);

	const submittedAt = report.submittedAt;

	const enrollmentParams: ApiOrganizationsOrgIdEnrollmentsGetRequest = {
		orgId: getIdForUser(user, 'org'),
		startDate: report.reportingPeriod && report.reportingPeriod.periodStart,
		endDate: report.reportingPeriod && report.reportingPeriod.periodEnd,
		asOf: submittedAt || undefined,
	};
	const { loading: allEnrollmentsLoading, data: allEnrollments } = useApi(
		(api) => api.apiOrganizationsOrgIdEnrollmentsGet(enrollmentParams),
		{ skip: !user || !report }
	);

	const splitTimeFundingSpaces = getFundingSpaces(
		report.organization && report.organization.fundingSpaces,
		{
			time: FundingTime.Split,
		}
	);

	// If we are still loading, show a loading page
	if (allEnrollmentsLoading) {
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
	if (!allEnrollments) {
		return <Alert {...somethingWentWrongAlert}></Alert>;
	}

	return (
		<>
			{report.submittedAt && (
				<p>
					<b>Submitted:</b> {dateFormatter(report.submittedAt)}{' '}
				</p>
			)}
			<div className="margin-top-2">
				<h1>Revenue</h1>
				{splitTimeFundingSpaces && splitTimeFundingSpaces.length && (
					<FieldSet
						className="usa-form usa-form--full-width margin-bottom-5"
						id="time-split-utilizations"
						legend="Funding time split utilizations"
					>
						{splitTimeFundingSpaces.map((fundingSpace) => (
							<TimeSplitUtilizationField
								key={fundingSpace.id}
								fundingSpace={fundingSpace}
								error={error}
								errorAlertState={errorAlertState}
							/>
						))}
					</FieldSet>
				)}
				<UtilizationTable />
				<div className="usa-form">
					<h2>Other Revenue</h2>
					<OtherRevenueFieldSet
						disabled={!!submittedAt}
						enrollments={allEnrollments}
						submittedAt={submittedAt || undefined}
						error={error}
						errorAlertState={errorAlertState}
					/>
					{!report.submittedAt && (
						<FormSubmitButton
							text={attemptingSave ? 'Submitting...' : 'Submit'}
							disabled={!canSubmit || attemptingSave}
						/>
					)}
				</div>
			</div>
		</>
	);
};

export default RevenueView;
