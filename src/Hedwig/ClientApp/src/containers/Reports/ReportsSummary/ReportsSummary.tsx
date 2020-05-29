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
	FundingSource,
} from '../../../generated';
import { getIdForUser, reportingPeriodFormatter } from '../../../utils/models';
import CommonContainer from '../../CommonContainer';
import { Alert } from '../../../components';
import { somethingWentWrongAlert } from '../../../utils/stringFormatters/alertTextMakers';

export default function ReportsSummary() {
	const { user } = useContext(UserContext);
	const orgParams: ApiOrganizationsIdGetRequest = {
		id: getIdForUser(user, 'org'),
	};
	const { loading: orgLoading, error: orgError, data: organization } = useApi(
		(api) => api.apiOrganizationsIdGet(orgParams),
		{ skip: !user }
	);
	const reportParams: ApiOrganizationsOrgIdReportsGetRequest = {
		orgId: getIdForUser(user, 'org'),
	};
	const { loading, error, data: reports } = useApi(
		(api) => api.apiOrganizationsOrgIdReportsGet(reportParams),
		{ skip: !user }
	);

	if (loading || error || orgLoading || orgError) {
		return <div className="Reports"></div>;
	}

	// If we stopped loading, and still don't have these values
	// Then an error other than a validation error ocurred.
	// (Or if in staging, it is possible a new deployment
	// happened, and then a user navigates back to roster after a delay, which causes
	// 401/403 errors to occur unless a hard refresh occurs.)
	// For now, show a general purpose alert message.
	if (!reports || !organization) {
		return <Alert {...somethingWentWrongAlert}></Alert>;
	}

	const pendingReports = reports.filter((r) => !r.submittedAt);

	const defaultTableProps: TableProps<Report> = {
		id: 'reports-table',
		data: reports,
		fullWidth: true,
		rowKey: (row) => row.id,
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
				sort: (row) => row.reportingPeriod.period.getTime() || 0,
				width: '21%',
			},
			{
				name: 'Type',
				cell: ({ row }) => <td>{row.type}</td>,
				sort: (row) => row.type as FundingSource,
				width: '16%',
			},
			{
				name: 'Program/Site',
				cell: (_) => <td>{organization.name}</td>,
				sort: (_) => organization.name || '',
				width: '38%',
			},
		],
		defaultSortColumn: 0,
		defaultSortOrder: 'descending',
	};

	const pendingTableProps: TableProps<Report> = {
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
				sort: (row) => row.reportingPeriod.dueAt.getTime() || 0,
				width: '24%',
			},
		],
		defaultSortColumn: 3,
		defaultSortOrder: 'ascending',
	};

	const submittedTableProps: TableProps<Report> = {
		...defaultTableProps,
		id: 'submitted-reports-table',
		data: reports.filter((r) => !!r.submittedAt),
		columns: [
			...defaultTableProps.columns,
			{
				name: 'Date submitted',
				cell: ({ row }) => (
					<td className="oec-table__cell--tabular-nums">{dateFormatter(row.submittedAt)}</td>
				),
				sort: (row) => (row.submittedAt && row.submittedAt.getTime()) || 0,
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
						<Table {...pendingTableProps} />
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
					<Table {...submittedTableProps} />
				</section>
			</div>
		</CommonContainer>
	);
}
