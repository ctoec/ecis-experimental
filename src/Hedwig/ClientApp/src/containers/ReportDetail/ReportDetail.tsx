import React, { useState, useContext } from 'react';
import idx from 'idx';
import { useParams } from 'react-router-dom';
import ReportSubmitForm from './ReportSubmitForm';
import monthFormatter from '../../utils/monthFormatter';
import dateFormatter from '../../utils/dateFormatter';
import DirectionalLink from '../../components/DirectionalLink/DirectionalLink';
import Tag from '../../components/Tag/Tag';
import UserContext from '../../contexts/User/UserContext';
import getIdForUser from '../../utils/getIdForUser';
import useApi from '../../hooks/useApi';
import UtilizationTable from './UtilizationTable';
import missingInformation from '../../utils/missingInformation';
import { Enrollment } from '../../OAS-generated/models/Enrollment';
import Alert from '../../components/Alert/Alert';
import Button from '../../components/Button/Button';

export default function ReportDetail() {
	let { id } = useParams();
	const { user } = useContext(UserContext);
	const reportParams = {
		id: parseInt(id || '0'),
		orgId: getIdForUser(user, 'org'),
		include: ['organizations', 'enrollments', 'sites', 'funding_spaces'],
	};
	const [loading, error, report] = useApi(
		api => api.apiOrganizationsOrgIdReportsIdGet(reportParams),
		[user]
	);

	if (!report) {
		return <div className="Report"></div>;
	}

	const reportEnrollments = idx(report, _ => _.organization.sites[0].enrollments);
	let numEnrollmentsMissingInfo = reportEnrollments
		? reportEnrollments.filter(enrollment => missingInformation(enrollment as Enrollment)).length
		: 0;

	return (
		<div className="Report">
			<section className="grid-container">
				<DirectionalLink direction="left" to="/reports" text="Back to reports" />
				{numEnrollmentsMissingInfo > 0 && (
					<Alert
						type="error"
						heading="Update roster"
						text={`There are ${numEnrollmentsMissingInfo} enrollments missing information required to submit this CDC report.`}
						actionItem={<Button text="Update roster" href="/roster" />}
					/>
				)}
				<h1>
					{monthFormatter(idx(report, _ => _.reportingPeriod.period))} {report.type} Report{' '}
					{!report.submittedAt && (
						<Tag text="DRAFT" color="gold-20v" addClass="margin-left-1 text-middle" />
					)}
				</h1>
				<p className="usa-intro">
					{idx(report, _ => _.organization.name)} |{' '}
					{dateFormatter(idx(report, _ => _.reportingPeriod.periodStart))} -{' '}
					{dateFormatter(idx(report, _ => _.reportingPeriod.periodEnd))}
				</p>
				<UtilizationTable {...report} />
				<ReportSubmitForm {...report} />
			</section>
		</div>
	);
}
