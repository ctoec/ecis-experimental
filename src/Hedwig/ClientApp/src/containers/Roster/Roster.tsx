import React, { useState } from 'react';
import useAuthQuery from '../../hooks/useAuthQuery';
import { gql } from 'apollo-boost';
import { Link } from 'react-router-dom';
import { RosterQuery, RosterQuery_me_sites_enrollments } from '../../generated/RosterQuery';
import nameFormatter from '../../utils/nameFormatter';
import dateFormatter from '../../utils/dateFormatter';
import enrollmentTextFormatter from '../../utils/enrollmentTextFormatter';
import getDefaultDateRange from '../../utils/getDefaultDateRange';
import { Table, TableProps } from '../../components/Table/Table';
import Tag from '../../components/Tag/Tag';
import { DateRange } from '../../components/DatePicker/DatePicker';
import Button from '../../components/Button/Button';
import RadioGroup from '../../components/RadioGroup/RadioGroup';
import DateSelectionForm from './DateSelectionForm';
import getColorForFundingSource from '../../utils/getColorForFundingType';
import { Age } from "../../generated/globalTypes";

export const ROSTER_QUERY = gql`
	query RosterQuery($from: Date, $to: Date) {
		me {
			sites {
				id
				name
				enrollments(from: $from, to: $to) {
					id
					entry
					exit
					age
					child {
						id
						firstName
						middleName
						lastName
						birthdate
						suffix
					}
					fundings {
						source
						time
					}
				}
			}
		}
	}
`;

export default function Roster() {
	const [showPastEnrollments, toggleShowPastEnrollments] = useState(false);
	const [dateRange, setDateRange] = useState<DateRange>(getDefaultDateRange());
	const [byRange, setByRange] = useState(false);

	function handlePastEnrollmentsChange() {
		toggleShowPastEnrollments(!showPastEnrollments);
		setByRange(false);
		setDateRange(getDefaultDateRange());
	}

	const { loading, error, data } = useAuthQuery<RosterQuery>(ROSTER_QUERY, {
		variables: {
			from: dateRange.startDate && dateRange.startDate.format('YYYY-MM-DD'),
			to: dateRange.endDate && dateRange.endDate.format('YYYY-MM-DD'),
		},
	});

	if (loading || error || !data || !data.me) {
		return <div className="Roster"></div>;
	}

	const site = data.me.sites[0];
	const enrollments = site.enrollments;

	const defaultRosterTableProps: TableProps<RosterQuery_me_sites_enrollments> = {
		id: 'roster-table',
		data: [],
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
				sort: row => row.child.birthdate || '',
			},
			{
				name: 'Funding',
				cell: ({ row }) => (
					<td>{row.fundings.length ? <Tag text={`${row.fundings[0].source}`} color={getColorForFundingSource(row.fundings[0].source)}/> : ''}</td>
				),
			},
			{
				name: 'Enrolled',
				cell: ({ row }) => (
					<td className="oec-table__cell--tabular-nums">
						{row.entry
							? dateFormatter(row.entry) + '–' + (row.exit ? dateFormatter(row.exit) : '')
							: ''}
					</td>
				),
				sort: row => row.entry || '',
			},
		],
		defaultSortColumn: 0,
		defaultSortOrder: 'asc',
	};

	const infantRosterTableProps: TableProps<RosterQuery_me_sites_enrollments> = {
		...defaultRosterTableProps,
		id: "infant-roster-table",
		data: enrollments.filter(enrollment => enrollment.age === Age.INFANT)
	};

	const preschoolRosterTableProps: TableProps<RosterQuery_me_sites_enrollments> = {
		...defaultRosterTableProps,
		id: "preschool-roster-table",
		data: enrollments.filter(enrollment => enrollment.age === Age.PRESCHOOL)
	};

	const schoolRosterTableProps: TableProps<RosterQuery_me_sites_enrollments> = {
		...defaultRosterTableProps,
		id: "school-roster-table",
		data: enrollments.filter(enrollment => enrollment.age === Age.SCHOOL)
	};

	const incompleteRosterTableProps: TableProps<RosterQuery_me_sites_enrollments> = {
		...defaultRosterTableProps,
		id: "incomplete-roster-table",
		data: enrollments.filter(enrollment => !enrollment.age)
	};

	const numKidsEnrolledText = enrollmentTextFormatter(
		enrollments.length,
		showPastEnrollments,
		dateRange,
		byRange
	);

	return (
		<div className="Roster">
			<section className="grid-container">
				<h1 className="grid-col-auto">{site.name}</h1>
				<div className="grid-row">
					<div className="tablet:grid-col-fill">
						<p className="usa-intro display-flex flex-row flex-wrap flex-justify-start">
							<span className="margin-right-2 flex-auto">{numKidsEnrolledText}</span>
							<Button
								text={
									showPastEnrollments ? 'Show only current enrollments' : 'Show past enrollments'
								}
								appearance="unstyled"
								onClick={handlePastEnrollmentsChange}
							/>
						</p>
					</div>
					<div className="tablet:grid-col-auto">
						<Button text="Enroll child" href={`/roster/sites/${site.id}/enroll`} />
					</div>
				</div>
				{showPastEnrollments && (
					<div className="usa-fieldset">
						<RadioGroup
							options={[
								{
									text: 'By date',
									value: 'date',
								},
								{
									text: 'By range',
									value: 'range',
								},
							]}
							onChange={event => setByRange(event.target.value === 'range')}
							horizontal={true}
							groupName={'dateSelectionType'}
							legend="Select date or date range."
							selected={byRange ? 'range' : 'date'}
						/>
						<DateSelectionForm
							inputDateRange={dateRange}
							byRange={byRange}
							onReset={() => {
								setByRange(false);
								setDateRange(getDefaultDateRange());
							}}
							onSubmit={(newDateRange: DateRange) => setDateRange(newDateRange)}
						/>
					</div>
				)}

				{!!infantRosterTableProps.data.length &&
					<>
						<h2>Infant/Toddler ({infantRosterTableProps.data.length} children)</h2>
						<Table {...infantRosterTableProps} fullWidth />
					</>
				}
				{!!preschoolRosterTableProps.data.length &&
					<>
						<h2>Preschool ({preschoolRosterTableProps.data.length} children)</h2>
						<Table {...preschoolRosterTableProps} fullWidth />
					</>
				}
				{!!schoolRosterTableProps.data.length &&
					<>
						<h2>School ({schoolRosterTableProps.data.length} children)</h2>
						<Table {...schoolRosterTableProps} fullWidth />
					</>
				}
				{!!incompleteRosterTableProps.data.length &&
					<>
						<h2>Incomplete ({incompleteRosterTableProps.data.length} children)</h2>
						<Table {...incompleteRosterTableProps} fullWidth />
					</>
				}
			</section>
		</div>
	);
}
