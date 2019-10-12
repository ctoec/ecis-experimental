import React, { useState } from 'react';
import useAuthQuery from '../../hooks/useAuthQuery';
import { gql } from 'apollo-boost';
import { Link } from 'react-router-dom';
import pluralize from 'pluralize';
import moment from 'moment';
import { Table, TableProps } from '../../components/Table/Table';
import { RosterQuery, RosterQuery_me_sites_enrollments } from '../../generated/RosterQuery';
import nameFormatter from '../../utils/nameFormatter';
import dateFormatter from '../../utils/dateFormatter';
import Tag from '../../components/Tag/Tag';
import DatePicker from '../../components/DatePicker/DatePicker';
import Button from '../../components/Button/Button';

export default function Roster() {

  const [showPastEnrollments, toggleShowPastEnrollments] = useState(false);

  function handlePastEnrollmentsChange() {
    toggleShowPastEnrollments(!showPastEnrollments);
  }

  // TODO: change query based on date range
	const { loading, error, data } = useAuthQuery<RosterQuery>(gql`
		query RosterQuery {
			me {
				sites {
					id
					name
					enrollments {
						id
						name
						enrollments(from: $from, to: $to) {
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
		`,
		{
			variables: {
				from: currentDateRange.startDate,
				to: currentDateRange.endDate,
			},
		}
	);

	if (loading || error || !data || !data.me) {
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
						<Link to={`/enrollments/${row.id}`} className="usa-link">
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

  // TODO: MAKE BUTTON NOT A CHILD OF PARAGRAPH
	return (
		<div className="Roster">
			<section className="grid-container">
        <h1 className="grid-col-auto">{site.name}</h1>
        <p className="usa-intro display-flex flex-row flex-wrap flex-justify-start">
          <span className="margin-right-2 flex-auto">
            {pluralize('kid', enrollments.length, true)} enrolled.
          </span>
          <Button
            text={"Show past enrollments"}
            appearance="unstyled"
            onClick={handlePastEnrollmentsChange}
          />
        </p>
        {showPastEnrollments &&
          <DatePicker
            onSubmit={() => console.log('cat')}
          />
        }
				<Table {...rosterTableProps} fullWidth />
			</section>
		</div>
	);
}
