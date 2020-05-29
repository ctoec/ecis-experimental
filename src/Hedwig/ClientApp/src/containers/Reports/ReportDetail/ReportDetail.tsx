import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import ReportSubmitForm from './ReportSubmitForm';
import dateFormatter from '../../../utils/dateFormatter';
import UserContext from '../../../contexts/User/UserContext';
import { getIdForUser, reportingPeriodFormatter } from '../../../utils/models';
import useApi from '../../../hooks/useApi';
import { Button, AlertProps, DirectionalLinkProps, Tag, Alert } from '../../../components';
import CommonContainer from '../../CommonContainer';
import { updateRosterAlert } from '../../../utils/stringFormatters';
import { somethingWentWrongAlert } from '../../../utils/stringFormatters/alertTextMakers';

export default function ReportDetail() {
	const { id } = useParams();
	const { user } = useContext(UserContext);
	const reportParams = {
		id: parseInt(id || '0'),
		orgId: getIdForUser(user, 'org'),
		include: ['organizations', 'enrollments', 'sites', 'funding_spaces', 'child'],
	};
	const { loading, error, data: report } = useApi(
		(api) => api.apiOrganizationsOrgIdReportsIdGet(reportParams),
		{ skip: !user }
	);

	if (loading) {
		return <div className="Report">Loading...</div>;
	}

	// If we stopped loading, and still don't have these values
	// Then an error other than a validation error ocurred.
	// (Or if in staging, it is possible a new deployment
	// happened, and then a user navigates back to roster after a delay, which causes
	// 401/403 errors to occur unless a hard refresh occurs.)
	// For now, show a general purpose alert message.
	if (!report) {
		return <Alert {...somethingWentWrongAlert}></Alert>;
	}

	if (!report.organization) {
		throw new Error(
			'API did not return organization on report. Please check your include parameters.'
		);
	}

	const numEnrollmentsMissingInfo = (report.enrollments || []).filter(
		(e) => !!e.validationErrors && e.validationErrors.length > 0
	).length;

	let additionalAlerts: AlertProps[] = [];

	if (numEnrollmentsMissingInfo) {
		additionalAlerts.push(updateRosterAlert(numEnrollmentsMissingInfo));
	}

	const directionalLinkProps: DirectionalLinkProps = {
		direction: 'left',
		to: '/reports',
		text: 'Back to reports',
	};

	return (
		<CommonContainer
			additionalAlerts={additionalAlerts || undefined}
			directionalLinkProps={directionalLinkProps}
		>
			<div className="grid-container">
				<div className="grid-row flex-first-baseline flex-space-between">
					<h1 className="tablet:grid-col-auto">
						{reportingPeriodFormatter(report.reportingPeriod)} {report.type} Report{' '}
						{!report.submittedAt && (
							<Tag text="DRAFT" color="gold-20v" className="margin-left-1 text-middle" />
						)}
					</h1>
					<div className="tablet:grid-col-auto print-btn">
						<Button text="Print" onClick={window.print} appearance="outline" />
					</div>
				</div>
				<p className="usa-intro">
					{report.organization.name} <br />
					{dateFormatter(report.reportingPeriod.periodStart, false)}–
					{dateFormatter(report.reportingPeriod.periodEnd, false)}
				</p>
				<ReportSubmitForm
					report={report}
					error={error}
					canSubmit={numEnrollmentsMissingInfo === 0}
				/>
			</div>
		</CommonContainer>
	);
}
