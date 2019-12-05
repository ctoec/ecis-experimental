import React from 'react';
import { gql } from 'apollo-boost';
import { useParams } from 'react-router-dom';
import { ReportQuery } from '../../generated/ReportQuery';
import ReportSubmitForm from './ReportSubmitForm';
import monthFormatter from '../../utils/monthFormatter';
import dateFormatter from '../../utils/dateFormatter';
import useAuthQuery from '../../hooks/useAuthQuery';
import DirectionalLink from '../../components/DirectionalLink/DirectionalLink';
import Tag from '../../components/Tag/Tag';

export const REPORT_QUERY = gql`
	query ReportQuery($id: ID!) {
		report(id: $id) {
			... on CdcReportType {
				id
				type
				period
				periodStart
				periodEnd
				submittedAt
				accredited
				organization {
					id
					name
				}
			}
		}
	}
`;

export default function ReportDetail() {
	let { id } = useParams();
	const { loading, error, data } = useAuthQuery<ReportQuery>(REPORT_QUERY, {
		variables: { id },
	});

	if (loading || error || !data || !data.report) {
		return <div className="Report"></div>;
	}

	return (
		<div className="Report">
			<section className="grid-container">
				<DirectionalLink direction="left" to="/reports" text="Back to reports" />
				<h1>
					{monthFormatter(data.report.period)} {data.report.type} Report{' '}
					{!data.report.submittedAt && (
						<Tag text="DRAFT" color="gold-30v" addClass="margin-left-1 text-middle" />
					)}
				</h1>
				<p className="usa-intro">
					{data.report.organization.name} | {dateFormatter(data.report.periodStart)} -{' '}
					{dateFormatter(data.report.periodEnd)}
				</p>
				<ReportSubmitForm {...data.report} />
			</section>
		</div>
	);
}
