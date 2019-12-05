import React, { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import ReportSubmitForm from './ReportSubmitForm';
import monthFormatter from '../../utils/monthFormatter';
import dateFormatter from '../../utils/dateFormatter';
import DirectionalLink from '../../components/DirectionalLink/DirectionalLink';
import Tag from '../../components/Tag/Tag';
import UserContext from '../../contexts/User/UserContext';
import getIdForUser from '../../utils/getIdForUser';
import useApi from '../../hooks/useApi';


export default function ReportDetail() {
	let { id } = useParams();
	const { user } = useContext(UserContext);
	const reportParams = {
		id: parseInt(id || '0'),
		orgId: getIdForUser(user, "org"),
		include: ['reportingPeriods'],
	};
	const [loading, error, report] = useApi(
		api => api.apiOrganizationsOrgIdReportsIdGet(reportParams),
		[user]
	);

	if (!report) {
		return <div className="Report"></div>;
	}

	console.log(report)

	return (
		<div className="Report">
			<section className="grid-container">
				<DirectionalLink direction="left" to="/reports" text="Back to reports" />
				<h1>
					{monthFormatter(report.period)} {report.type} Report{' '}
					{!report.submittedAt && (
						<Tag text="DRAFT" color="gold-30v" addClass="margin-left-1 text-middle" />
					)}
				</h1>
				<p className="usa-intro">
					{report.organization.name} | {dateFormatter(report.periodStart)} -{' '}
					{dateFormatter(report.periodEnd)}
				</p>
				<ReportSubmitForm {...report} />
			</section>
		</div>
	);
}
