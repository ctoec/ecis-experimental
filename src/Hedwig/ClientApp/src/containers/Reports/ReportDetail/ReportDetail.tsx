import React, { useContext } from 'react';
import idx from 'idx';
import { useParams } from 'react-router-dom';
import ReportSubmitForm from './ReportSubmitForm';
import monthFormatter from '../../../utils/monthFormatter';
import dateFormatter from '../../../utils/dateFormatter';
import DirectionalLink from '../../../components/DirectionalLink/DirectionalLink';
import Tag from '../../../components/Tag/Tag';
import UserContext from '../../../contexts/User/UserContext';
import getIdForUser from '../../../utils/getIdForUser';
import useApi from '../../../hooks/useApi';
import { Enrollment } from '../../../generated/models/Enrollment';
import Button from '../../../components/Button/Button';
import Alert from '../../../components/Alert/Alert';
import { DeepNonUndefineable, tsFilter } from '../../../utils/types';
import AlertContext from '../../../contexts/Alert/AlertContext';

export default function ReportDetail() {
	const { id } = useParams();
	const { user } = useContext(UserContext);
	const reportParams = {
		id: parseInt(id || '0'),
		orgId: getIdForUser(user, 'org'),
		include: ['organizations', 'enrollments', 'sites', 'funding_spaces', 'child'],
	};
	const [loading, error, report, mutate] = useApi(
		api => api.apiOrganizationsOrgIdReportsIdGet(reportParams),
		[user]
	);
	const { getAlerts } = useContext(AlertContext);
	const alerts = getAlerts();

	if (loading || error || !report) {
		return <div className="Report"></div>;
	}

	const reportEnrollments = idx(
		report,
		_ => _.organization.sites[0].enrollments
	) as DeepNonUndefineable<Enrollment[]>;

	let numEnrollmentsMissingInfo = reportEnrollments
		? tsFilter<Enrollment>(
				reportEnrollments,
				e => !!e.validationErrors && e.validationErrors.length > 0
		  ).length
		: 0;

	return (
		<div className="Report">
			<section className="grid-container">
				<DirectionalLink direction="left" to="/reports" text="Back to reports" />
				{alerts.map((alert, index) => (
					<Alert key={index} {...alert}></Alert>
				))}
				{numEnrollmentsMissingInfo > 0 && (
					<Alert
						type="error"
						heading="Update roster"
						text={`There are ${numEnrollmentsMissingInfo} enrollments missing information required to submit this CDC report.`}
						actionItem={<Button text="Update roster" href="/roster" />}
					/>
				)}
				<div className="grid-row flex-first-baseline flex-space-between">
					<h1 className="tablet:grid-col-auto">
						{monthFormatter(idx(report, _ => _.reportingPeriod.period))} {report.type} Report{' '}
						{!report.submittedAt && (
							<Tag text="DRAFT" color="gold-20v" className="margin-left-1 text-middle" />
						)}
					</h1>
					<div className="tablet:grid-col-auto print-btn">
						<Button text="Print" onClick={window.print} appearance="outline" />
					</div>
				</div>
				<p className="usa-intro">
					{idx(report, _ => _.organization.name)} <br />
					{dateFormatter(idx(report, _ => _.reportingPeriod.periodStart))}–
					{dateFormatter(idx(report, _ => _.reportingPeriod.periodEnd))}
				</p>
				<ReportSubmitForm
					report={report}
					mutate={mutate}
					canSubmit={numEnrollmentsMissingInfo === 0}
				/>
			</section>
		</div>
	);
}
