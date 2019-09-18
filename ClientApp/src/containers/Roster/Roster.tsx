import React, { useLayoutEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { Link } from 'react-router-dom';
import pluralize from 'pluralize';
import { Table, TableProps } from '../../components/Table/Table';
import { RosterQuery, RosterQuery_user_sites_enrollments } from '../../generated/RosterQuery';
import nameFormatter from '../../utils/nameFormatter';
import dateFormatter from '../../utils/dateFormatter';
import Button from '../../components/Button/Button';
import withPrintMode, { WithPrintModePropsType } from '../../contexts/PrintMode/PrintModeHOC';

const Roster: React.FC<WithPrintModePropsType> = ({isPrintMode, togglePrintMode}) => {
	const { loading, error, data } = useQuery<RosterQuery>(gql`
		query RosterQuery {
			user(id: 1) {
				sites {
					id
					name
					enrollments {
						id
						entry
						exit
						child {
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

	useLayoutEffect(() => {
		if (isPrintMode) {
			window.print();
		}
	});

	if (loading || error || !data || !data.user) {
		return <div className="Roster"></div>;
	}

	const site = data.user.sites[0];
	const enrollments = site.enrollments;

	const rosterTableProps: TableProps<RosterQuery_user_sites_enrollments> = {
		id: 'roster-table',
		data: enrollments,
		rowKey: row => row.id,
		columns: [
			{
				name: 'Name',
				cell: ({ row }) => (
					<th scope="row">
						<Link to={`/enrollments/${row.id}`} className="usa-link">
							{nameFormatter(row.child)}
						</Link>
					</th>
				),
				sort: row => nameFormatter(row.child),
			},
			{
				name: 'Date of birth',
				cell: ({ row }) => <td>{dateFormatter(row.child.birthdate)}</td>,
				sort: row => row.child.birthdate,
			},
		],
		defaultSortColumn: 0,
		defaultSortOrder: 'asc',
	};

	return (
		<div className="Roster">
			<section className="grid-container">
					<div className="print-cancel">
						{isPrintMode && <Button
							text="X"
							onClick={togglePrintMode}
							appearance='base'
						/>}
					</div>
				<h1>{site.name}</h1>
				<p className="usa-intro">{pluralize('kid', enrollments.length, true)} enrolled</p>
				<Table {...rosterTableProps} fullWidth />
				<div className="print-btn">
					{!isPrintMode && <Button
						text='Print'
						onClick={() => {
							togglePrintMode()
							window.scrollTo(0, 0);
						}}
						appearance='outline'
					/>}
				</div>
			</section>
		</div>
	);
}

export default withPrintMode(Roster);