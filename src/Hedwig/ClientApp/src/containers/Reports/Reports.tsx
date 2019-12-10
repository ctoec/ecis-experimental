import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import pluralize from 'pluralize';
import { Table, TableProps } from '../../components/Table/Table';
import InlineIcon from '../../components/InlineIcon/InlineIcon';
import monthFormatter from '../../utils/monthFormatter';
import dateFormatter from '../../utils/dateFormatter';
import UserContext from '../../contexts/User/UserContext';
import useApi from '../../hooks/useApi';
import { 
	ApiOrganizationsOrgIdReportsGetRequest,
	Report,
	ApiOrganizationsIdGetRequest
} from '../../OAS-generated';
import getIdForUser from '../../utils/getIdForUser';

export default function Reports() {
	const { user } = useContext(UserContext);
	const orgParams: ApiOrganizationsIdGetRequest = {
		id: getIdForUser(user, 'org')
	}
	const [ orgLoading, orgError, organization] = useApi(
		(api) => api.apiOrganizationsIdGet(orgParams),
		[user]
	)
	const reportParams: ApiOrganizationsOrgIdReportsGetRequest = {
		orgId: getIdForUser(user, 'org')
	}
	const [ loading, error, rawReports ] = useApi(
		(api) => api.apiOrganizationsOrgIdReportsGet(reportParams),
		[user]
	);

	if (loading || error || !rawReports || orgLoading || orgError || !organization) {
		return <div className="Reports"></div>;
	}

	const reports = (rawReports || []).map(e => e as Required<Report>);

	const unsubmittedReportsCount = reports.filter(report => !report.submittedAt).length;

	const reportsTableProps: TableProps<Required<Report>> = {
		id: 'reports-table',
		data: reports,
		rowKey: row => row.id,
		columns: [
			{
				name: 'Period',
				cell: ({ row }) => (
					<th scope="row">
						<Link to={`/reports/${row.id}`} className="usa-link">
							{monthFormatter(row.reportingPeriod.period)}
						</Link>
						&nbsp;
						{!row.submittedAt && <InlineIcon icon="attentionNeeded" />}
					</th>
				),
				sort: row => (row.reportingPeriod.period && row.reportingPeriod.period.getMonth()) || -1,
			},
			{
				name: 'Type',
				cell: ({ row }) => <td>{row.type}</td>,
				sort: row => row.type,
			},
			{
				name: 'Program/Site',
				cell: _ => <td>{organization.name}</td>,
				sort: _ => organization.name || '',
			},
			{
				name: 'Date submitted',
				cell: ({ row }) => {
					return row.submittedAt ? (
						<td className="oec-table__cell--tabular-nums">{dateFormatter(row.submittedAt)}</td>
					) : (
						<td className="oec-table__cell--gray">due {dateFormatter(row.reportingPeriod.dueAt)}</td>
					);
				},
				sort: row => (row.submittedAt && row.submittedAt.getTime())
										|| (row.reportingPeriod.dueAt && row.reportingPeriod.dueAt.getTime())
										|| 0,
			},
		],
		defaultSortColumn: 0,
		defaultSortOrder: 'descending',
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
