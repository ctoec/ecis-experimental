import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Table, TableProps } from '../../../components/Table/Table';
import dateFormatter from '../../../utils/dateFormatter';
import UserContext from '../../../contexts/User/UserContext';
import useApi from '../../../hooks/useApi';
import {
	ApiOrganizationsOrgIdReportsGetRequest,
	CdcReport as Report,
	ApiOrganizationsIdGetRequest,
} from '../../../generated';
import { getIdForUser, reportingPeriodFormatter } from '../../../utils/models';
import { DeepNonUndefineable } from '../../../utils/types';
import CommonContainer from '../../CommonContainer';

export default function ReportsSummary() {
	const { user } = useContext(UserContext);
	const orgParams: ApiOrganizationsIdGetRequest = {
		id: getIdForUser(user, 'org'),
	};
	const [orgLoading, orgError, organization] = useApi(api => api.apiOrganizationsIdGet(orgParams), [
		user,
	]);
	const reportParams: ApiOrganizationsOrgIdReportsGetRequest = {
		orgId: getIdForUser(user, 'org'),
	};
	const [loading, error, reports] = useApi(
		api => api.apiOrganizationsOrgIdReportsGet(reportParams),
		[user]
	);

	if (loading || error || !reports || orgLoading || orgError || !organization) {
		return <div className="Reports"></div>;
	}

	const pendingReports = reports.filter<DeepNonUndefineable<Report>>(
		(r => !r.submittedAt) as (_: DeepNonUndefineable<Report>) => _ is DeepNonUndefineable<Report>
	);

	const defaultTableProps: TableProps<DeepNonUndefineable<Report>> = {
		id: 'reports-table',
		data: reports,
		rowKey: row => row.id,
		columns: [
			{
				name: 'Period',
				cell: ({ row }) => (
					<th scope="row">
						<Link to={`/reports/${row.id}`} className="usa-link">
							{reportingPeriodFormatter(row.reportingPeriod)}
						</Link>
					</th>
				),
				sort: row => row.reportingPeriod.period.getTime() || 0,
				width: '21%',
			},
			{
				name: 'Type',
				cell: ({ row }) => <td>{row.type}</td>,
				sort: row => row.type,
				width: '16%',
			},
			{
				name: 'Program/Site',
				cell: _ => <td>{organization.name}</td>,
				sort: _ => organization.name || '',
				width: '38%',
			},
		],
		defaultSortColumn: 0,
		defaultSortOrder: 'descending',
	};

	const pendingTableProps: TableProps<DeepNonUndefineable<Report>> = {
		...defaultTableProps,
		id: 'pending-reports-table',
		data: pendingReports,
		columns: [
			...defaultTableProps.columns,
			{
				name: 'Due date',
				cell: ({ row }) => (
					<td className="oec-table__cell--tabular-nums oec-table__cell--gray">
						{dateFormatter(row.reportingPeriod.dueAt)}
					</td>
				),
				sort: row => row.reportingPeriod.dueAt.getTime() || 0,
				width: '24%',
			},
		],
		defaultSortColumn: 3,
		defaultSortOrder: 'ascending',
	};

	const submittedTableProps: TableProps<DeepNonUndefineable<Report>> = {
		...defaultTableProps,
		id: 'submitted-reports-table',
		data: reports.filter<DeepNonUndefineable<Report>>(
			(r => !!r.submittedAt) as (_: DeepNonUndefineable<Report>) => _ is DeepNonUndefineable<Report>
		),
		columns: [
			...defaultTableProps.columns,
			{
				name: 'Date submitted',
				cell: ({ row }) => (
					<td className="oec-table__cell--tabular-nums">{dateFormatter(row.submittedAt)}</td>
				),
				sort: row => (row.submittedAt && row.submittedAt.getTime()) || 0,
				width: '24%',
			},
		],
	};

	return (
		<CommonContainer>
			<div className="grid-container">
				<h1>Reports</h1>
				<section>
					<h2 className="margin-top-4">Pending reports</h2>
					{pendingReports.length > 0 ? (
						<Table {...pendingTableProps} fullWidth />
					) : (
						<p>
							<em>
								No reports pending. Reports become available after the end of the reporting period.
							</em>
						</p>
					)}
				</section>
				<section>
					<h2 className="margin-top-6">Submitted reports</h2>
					<Table {...submittedTableProps} fullWidth />
				</section>
			</div>
		</CommonContainer>
	);
}
