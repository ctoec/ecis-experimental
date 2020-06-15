import React, { useState, useEffect, useContext } from 'react';
import {
	CdcReport,
	ApiOrganizationsOrgIdReportsIdPutRequest,
	ApiOrganizationsOrgIdEnrollmentsGetRequest,
	FundingTime,
} from '../../../generated';
import useApi, { ApiError } from '../../../hooks/useApi';
import UserContext from '../../../contexts/User/UserContext';
import { FieldSet, ErrorBoundary, Alert } from '../../../components';
import AppContext from '../../../contexts/App/AppContext';
import { getIdForUser, getFundingSpaces } from '../../../utils/models';
import UtilizationTable from './UtilizationTable';
import AlertContext from '../../../contexts/Alert/AlertContext';
import { useHistory } from 'react-router';
import { useFocusFirstError } from '../../../utils/validations';
import { reportSubmittedAlert, reportSubmitFailAlert } from '../../../utils/stringFormatters';
import dateFormatter from '../../../utils/dateFormatter';
import { Form, FormSubmitButton } from '../../../components/Form_New';
import useCatchAllErrorAlert from '../../../hooks/useCatchAllErrorAlert';
import {
	AccreditedField,
	TimeSplitUtilizationField,
	OtherRevenueFieldSet,
} from './ReportSubmitFields';
import { somethingWentWrongAlert } from '../../../utils/stringFormatters/alertTextMakers';

export type ReportSubmitFormProps = {
	report: CdcReport;
	error: ApiError | null;
	canSubmit: boolean;
};

export default function ReportSubmitForm({
	report: __report,
	error: inputError,
	canSubmit,
}: ReportSubmitFormProps) {
	const report = __report;
	const history = useHistory();

	const { user } = useContext(UserContext);

	const { invalidateCache: invalidateAppCache } = useContext(AppContext);
	const { getAlerts, setAlerts } = useContext(AlertContext);
	const alerts = getAlerts();

	const [mutatedReport, setMutatedReport] = useState(report);
	const submittedAt = mutatedReport.submittedAt;

	const params: ApiOrganizationsOrgIdReportsIdPutRequest = {
		id: report.id || 0,
		orgId: getIdForUser(user, 'org'),
	};

	const enrollmentParams: ApiOrganizationsOrgIdEnrollmentsGetRequest = {
		orgId: getIdForUser(user, 'org'),
		include: ['fundings'],
		startDate: report.reportingPeriod && report.reportingPeriod.periodStart,
		endDate: report.reportingPeriod && report.reportingPeriod.periodEnd,
		asOf: submittedAt || undefined,
	};
	const { loading: allEnrollmentsLoading, data: allEnrollments } = useApi(
		(api) => api.apiOrganizationsOrgIdEnrollmentsGet(enrollmentParams),
		{ skip: !user || !report }
	);

	const [error, setError] = useState(inputError);
	const errorAlertState = useCatchAllErrorAlert(error);
	useFocusFirstError([error]);

	const [attemptingSave, setAttemptingSave] = useState(false);
	const { loading, error: saveError, data: saveData } = useApi<CdcReport>(
		(api) =>
			api.apiOrganizationsOrgIdReportsIdPut({
				...params,
				cdcReport: mutatedReport,
			}),
		{
			skip: !user || !attemptingSave,
			callback: () => setAttemptingSave(false),
		}
	);

	useEffect(() => {
		if (!saveData && !saveError) {
			// If the request did not go through, exit
			return;
		}

		// Set the new error whether it's undefined or an error
		setError(saveError);
		if (saveData && !saveError) {
			const newAlert = reportSubmittedAlert(mutatedReport.reportingPeriod);
			const newAlerts = newAlert ? [...alerts, newAlert] : alerts;
			setAlerts(newAlerts);
			invalidateAppCache(); // Updates the count of unsubmitted reports in the nav bar
			history.push('/reports', newAlerts);
		}
	}, [
		saveData,
		saveError,
		history,
		setAlerts,
		invalidateAppCache,
		mutatedReport,
		setError,
		alerts,
	]);

	const splitTimeFundingSpaces = getFundingSpaces(
		mutatedReport.organization && mutatedReport.organization.fundingSpaces,
		{
			time: FundingTime.Split,
		}
	);

	const onSubmit = (userModifiedReport: CdcReport) => {
		setAttemptingSave(true);
		setMutatedReport(userModifiedReport);
	};

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
		<ErrorBoundary alertProps={reportSubmitFailAlert}>
			{mutatedReport.submittedAt && (
				<p>
					<b>Submitted:</b> {dateFormatter(mutatedReport.submittedAt)}{' '}
				</p>
			)}
			<Form<CdcReport>
				data={mutatedReport}
				onSubmit={onSubmit}
				className=""
				noValidate
				autoComplete="off"
			>
				<AccreditedField disabled={!!report.submittedAt} />
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
					<span>
						For all enrollments from {dateFormatter(report.reportingPeriod.periodStart)} to{' '}
						{dateFormatter(report.reportingPeriod.periodEnd)}
					</span>
					<OtherRevenueFieldSet
						disabled={!!submittedAt}
						enrollments={allEnrollments}
						submittedAt={submittedAt || undefined}
						error={error}
						errorAlertState={errorAlertState}
					/>
					{!mutatedReport.submittedAt && (
						<FormSubmitButton
							text={attemptingSave ? 'Submitting...' : 'Submit'}
							disabled={!canSubmit || attemptingSave || loading}
						/>
					)}
				</div>
			</Form>
		</ErrorBoundary>
	);
}
