import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { Link } from 'react-router-dom';
import { Table, TableProps } from '../../components/Table/Table';
import { ReportsQuery, ReportsQuery_user_reports } from '../../generated/ReportsQuery';
import monthFormatter from '../../utils/monthFormatter';
import dateFormatter from '../../utils/dateFormatter';

export const REPORTS_QUERY = gql`
	query ReportsQuery {
		user(id: 1) {
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
	const { loading, error, data } = useQuery<ReportsQuery>(REPORTS_QUERY);

	if (loading || error || !data || !data.user) {
		return <div className="Reports"></div>;
	}

	const reportsTableProps: TableProps<ReportsQuery_user_reports> = {
		id: 'reports-table',
		data: data.user.reports,
		rowKey: row => row.id,
		columns: [
			{
				name: 'Period',
				cell: ({ row }) => (
					<th scope="row">
						<Link to={`/reports/${row.id}`} className="usa-link">
							{monthFormatter(row.period)}
						</Link>
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
				<Table {...reportsTableProps} fullWidth />
			</section>
		</div>
	);
}
