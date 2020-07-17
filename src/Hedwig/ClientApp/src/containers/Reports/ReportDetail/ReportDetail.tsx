import React, { useContext, useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
	Button,
	AlertProps,
	Tag,
	Alert,
	Form,
	TabNav,
	TextWithIcon,
} from '@ctoec/component-library';
import { ReactComponent as FileDownload } from '../../../assets/images/fileDownloadSolid.svg';
import { ReactComponent as File } from '../../../assets/images/fileAltSolid.svg';
import dateFormatter from '../../../utils/dateFormatter';
import UserContext from '../../../contexts/User/UserContext';
import { getIdForUser, reportingPeriodFormatter } from '../../../utils/models';
import useApi, { ApiError } from '../../../hooks/useApi';
import CommonContainer from '../../CommonContainer';
import { updateRosterAlert } from '../../../utils/stringFormatters';
import {
	somethingWentWrongAlert,
	reportSubmittedAlert,
} from '../../../utils/stringFormatters/alertTextMakers';
import { CdcReport, ApiOrganizationsOrgIdReportsIdPutRequest } from '../../../generated';
import { AccreditedField } from './ReportSubmitFields';
import { useFocusFirstError } from '../../../utils/validations';
import useCatchAllErrorAlert from '../../../hooks/useCatchAllErrorAlert';
import AppContext from '../../../contexts/App/AppContext';
import AlertContext from '../../../contexts/Alert/AlertContext';
import RosterView from './RosterView/RosterView';
import RevenueView from './RevenueView/RevenueView';
import { downloadBlobAsFile } from '../../../utils/downloadBlobAsFile';
import { makeRosterCSVBlob } from './utils/makeRosterCSVBlob';
import { makeRevenueCSVBlob } from './utils/makeRevenueCSVBlob';

const ROSTER_ID = 'roster';
const REVENUE_ID = 'revenue';

export default function ReportDetail() {
	const { id } = useParams();
	const { user } = useContext(UserContext);

	const { invalidateCache: invalidateAppCache } = useContext(AppContext);
	const { getAlerts, setAlerts } = useContext(AlertContext);
	const alerts = getAlerts();

	const { location, push } = useHistory();
	const activeTabId = location.hash ? location.hash.slice(1) : ROSTER_ID;

	const [error, setError] = useState<ApiError | null>(null);
	const errorAlertState = useCatchAllErrorAlert(error);
	useFocusFirstError([error]);

	const reportParams = {
		id: parseInt(id || '0'),
		orgId: getIdForUser(user, 'org'),
	};
	const { loading, data: report } = useApi(
		(api) => api.apiOrganizationsOrgIdReportsIdGet(reportParams),
		{
			skip: !user,
		}
	);
	useEffect(() => {
		setMutatedReport(report);
	}, [report]);

	const [mutatedReport, setMutatedReport] = useState(report);
	const params: ApiOrganizationsOrgIdReportsIdPutRequest = {
		id: (report && report.id) || 0,
		orgId: getIdForUser(user, 'org'),
	};
	const [attemptingSave, setAttemptingSave] = useState(false);
	const { error: saveError, data: saveData } = useApi<CdcReport>(
		(api) =>
			api.apiOrganizationsOrgIdReportsIdPut({
				...params,
				cdcReport: mutatedReport || undefined,
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
			const newAlert = mutatedReport && reportSubmittedAlert(mutatedReport.reportingPeriod);
			const newAlerts = newAlert ? [...alerts, newAlert] : alerts;
			setAlerts(newAlerts);
			invalidateAppCache(); // Updates the count of unsubmitted reports in the nav bar
			push('/reports', newAlerts);
		}
	}, [saveData, saveError, setError]);

	if (loading) {
		return <div className="Report">Loading...</div>;
	}

	// If we stopped loading, and still don't have these values
	// Then an error other than a validation error ocurred.
	// (In staging, it is likely that a new deployment happened.
	// This changes the ids of the objects. Thus, when a user
	// navigates back to roster 401/403 errors to occur.
	// This can be resolved with a hard refresh. We don't do that
	// because if it truly is a 500 error, we would get an infite
	// loop). For now, show a general purpose alert message.
	if (!report || !mutatedReport) {
		return <Alert {...somethingWentWrongAlert}></Alert>;
	}

	if (!report.organization) {
		throw new Error('malformed API response');
	}

	const numEnrollmentsMissingInfo = (report.enrollments || []).filter(
		(e) => !!e.validationErrors && e.validationErrors.length > 0
	).length;

	let additionalAlerts: AlertProps[] = [];

	if (numEnrollmentsMissingInfo) {
		additionalAlerts.push(updateRosterAlert(numEnrollmentsMissingInfo, id));
	}

	const onSubmit = (userModifiedReport: CdcReport) => {
		setAttemptingSave(true);
		setMutatedReport(userModifiedReport);
	};

	return (
		<CommonContainer
			additionalAlerts={additionalAlerts || undefined}
			backHref="/reports"
			backText="Back to reports"
		>
			<div className="grid-container">
				<div className="grid-row flex-space-between">
					<div className="tablet:grid-col-auto">
						<div className="grid-row flex-display flex-row flex-align-center">
							<h1>
								{reportingPeriodFormatter(report.reportingPeriod)} {report.type} Report{' '}
							</h1>
							<Button
								text={
									<TextWithIcon
										text="Export report"
										Icon={FileDownload}
										className="margin-left-2"
									/>
								}
								appearance="unstyled"
								onClick={(
									e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement, MouseEvent>
								) => {
									e.preventDefault();

									const getFileName = (type: string) =>
										`CDC ${reportingPeriodFormatter(report.reportingPeriod)} Report - ${type} - ${
											report.organization?.name
										}.csv`;
									const rosterBlob = makeRosterCSVBlob(report.enrollments);
									downloadBlobAsFile(rosterBlob, getFileName('Report'));
									const revenueBlob = makeRevenueCSVBlob(report);
									downloadBlobAsFile(revenueBlob, getFileName('Revenue'));
								}}
							/>
						</div>
						<p className="usa-intro">
							{report.organization.name} <br />
							{dateFormatter(report.reportingPeriod.periodStart, { long: true })}–
							{dateFormatter(report.reportingPeriod.periodEnd, { long: true })}
						</p>
					</div>
					<div className="tablet:grid-col-auto display-flex flex-column flex-align-center">
						{report.submittedAt ? (
							<>
								<File height="5em" title="file" className="text-base" />
								<Tag className="margin-top-05" text="SUBMITTED" color="green-cool-20v" />
							</>
						) : (
							<>
								<File height="5em" title="file" className="text-base" />
								<Tag className="margin-top-05" text="DRAFT" color="gold-20v" />
							</>
						)}
					</div>
				</div>

				<Form<CdcReport>
					data={mutatedReport}
					onSubmit={onSubmit}
					className=""
					noValidate
					autoComplete="off"
				>
					<AccreditedField disabled={!!mutatedReport.submittedAt} />
					<TabNav
						items={[
							{
								id: ROSTER_ID,
								text: 'Roster',
								content: (
									<RosterView
										reportingPeriod={report.reportingPeriod}
										organization={report.organization}
										rosterEnrollments={report.enrollments || []}
									/>
								),
							},
							{
								id: REVENUE_ID,
								text: 'Revenue',
								content: (
									<RevenueView
										report={mutatedReport}
										error={error}
										errorAlertState={errorAlertState}
										canSubmit={numEnrollmentsMissingInfo === 0}
										attemptingSave={attemptingSave}
									/>
								),
							},
						]}
						activeId={activeTabId}
					/>
					{activeTabId === ROSTER_ID && (
						<div className="display-flex flex-end margin-top-4">
							<Button
								className=""
								text="Continue to revenue"
								onClick={() => push(`#${REVENUE_ID}`)}
							/>
						</div>
					)}
				</Form>
			</div>
		</CommonContainer>
	);
}
