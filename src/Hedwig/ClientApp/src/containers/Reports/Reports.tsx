import React, { useContext } from 'react';
import useAuthQuery from '../../hooks/useAuthQuery';
import { gql } from 'apollo-boost';
import { Link } from 'react-router-dom';
import pluralize from 'pluralize';
import { Table, TableProps } from '../../components/Table/Table';
import InlineIcon from '../../components/InlineIcon/InlineIcon';
import { ReportsQuery, ReportsQuery_me_reports } from '../../generated/ReportsQuery';
import monthFormatter from '../../utils/monthFormatter';
import dateFormatter from '../../utils/dateFormatter';
import UserContext from '../../contexts/User/UserContext';

export const REPORTS_QUERY = gql`
	query ReportsQuery {
		me {
			reports {
				... on CdcReportType {
					id
					type
					period
					dueAt
					submittedAt
					organization {
						id
						name
					}
				}
			}
		}
	}
`;

export default function Reports() {
  const { loading, error, data } = useAuthQuery<ReportsQuery>(REPORTS_QUERY);

	if (loading || error || !data || !data.me) {
		return <div className="Reports"></div>;
	}

	const unsubmittedReportsCount = data.me.reports.filter(report => !report.submittedAt).length;

	const reportsTableProps: TableProps<ReportsQuery_me_reports> = {
		id: 'reports-table',
		data: data.me.reports,
		rowKey: row => row.id,
		columns: [
			{
				name: 'Period',
				cell: ({ row }) => (
					<th scope="row">
						<Link to={`/reports/${row.id}`} className="usa-link">
							{monthFormatter(row.period)}
						</Link>
						&nbsp;
						{!row.submittedAt && <InlineIcon icon="attentionNeeded" />}
					</th>
				),
				sort: row => row.period,
			},
			{
				name: 'Type',
				cell: ({ row }) => <td>{row.type}</td>,
				sort: row => row.type,
			},
			{
				name: 'Program/Site',
				cell: ({ row }) => <td>{row.organization.name}</td>,
				sort: row => row.organization.name,
			},
			{
				name: 'Date submitted',
				cell: ({ row }) => {
					return row.submittedAt ? (
						<td className="oec-table__cell--tabular-nums">{dateFormatter(row.submittedAt)}</td>
					) : (
						<td className="oec-table__cell--gray">due {dateFormatter(row.dueAt)}</td>
					);
				},
				sort: row => row.submittedAt || row.dueAt,
			},
		],
		defaultSortColumn: 0,
		defaultSortOrder: 'desc',
	};

	return (
		<div className="Reports">
			<section className="grid-container">
				<h1>Reports</h1>
				{unsubmittedReportsCount > 0 && (
					<div className="oec-table-legend">
						<InlineIcon icon="attentionNeeded" /> <strong>{unsubmittedReportsCount}</strong>{' '}
						{pluralize('report', unsubmittedReportsCount)} due
					</div>
				)}
				<Table {...reportsTableProps} fullWidth />
			</section>
		</div>
	);
}
