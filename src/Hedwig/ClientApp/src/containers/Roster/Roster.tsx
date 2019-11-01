import React from 'react';
import useAuthQuery from '../../hooks/useAuthQuery';
import { gql } from 'apollo-boost';
import { Link } from 'react-router-dom';
import pluralize from 'pluralize';
import Button from '../../components/Button/Button';
import { Table, TableProps } from '../../components/Table/Table';
import { RosterQuery, RosterQuery_me_sites_enrollments } from '../../generated/RosterQuery';
import nameFormatter from '../../utils/nameFormatter';
import dateFormatter from '../../utils/dateFormatter';
import Tag from '../../components/Tag/Tag';

export default function Roster() {
	const { loading, error, data } = useAuthQuery<RosterQuery>(gql`
		query RosterQuery {
			me {
				sites {
					id
					name
					enrollments {
						id
						entry
						exit
						child {
							id
							firstName
							middleName
							lastName
							birthdate
							suffix
						}
						fundings {
							entry
							exit
							source
						}
					}
				}
			}
		}
	`);

	if (loading || error || !data || !data.me || data.me.sites.length === 0) {
		return <div className="Roster"></div>;
	}

	const site = data.me.sites[0];
	const enrollments = site.enrollments;

	const rosterTableProps: TableProps<RosterQuery_me_sites_enrollments> = {
		id: 'roster-table',
		data: enrollments,
		rowKey: row => row.id,
		columns: [
			{
				name: 'Name',
				cell: ({ row }) => (
					<th scope="row">
						<Link to={`/roster/enrollments/${row.child.id}/`} className="usa-link">
							{nameFormatter(row.child)}
						</Link>
					</th>
				),
				sort: row => nameFormatter(row.child),
			},
			{
				name: 'Date of birth',
				cell: ({ row }) => (
					<td className="oec-table__cell--tabular-nums">{dateFormatter(row.child.birthdate)}</td>
				),
				sort: row => row.child.birthdate,
			},
			{
				name: 'Funding',
				cell: ({ row }) => (
					<td>{row.fundings.length ? <Tag text={`${row.fundings[0].source}`} /> : ''}</td>
				),
			},
		],
		defaultSortColumn: 0,
		defaultSortOrder: 'asc',
	};

	return (
		<div className="Roster">
			<section className="grid-container">
				<h1>{site.name}</h1>
				<div className="grid-row">
					<div className="tablet:grid-col-fill">
						<p className="usa-intro">{pluralize('child', enrollments.length, true)} enrolled</p>
					</div>
					<div className="tablet:grid-col-auto">
						<Button text="Enroll child" href={`/roster/sites/${site.id}/enroll`} />
					</div>
				</div>
				<Table {...rosterTableProps} fullWidth />
			</section>
		</div>
	);
}
