import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RosterQuery_me_sites_enrollments } from '../../generated/RosterQuery';
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
import useOASClient from '../../hooks/useOASClient';

export default function Roster() {
	const [showPastEnrollments, toggleShowPastEnrollments] = useState(false);
	const [dateRange, setDateRange] = useState<DateRange>(getDefaultDateRange());
	const [byRange, setByRange] = useState(false);
	const { data, runQuery } = useOASClient('organizationsOrganizationIdSitesSiteIdGet', {
    // TODO: Get org and site id from authenticated user?
    // In graphql version we were just grabbing first of all sites per user
		organizationId: 1,
		siteId: 1,
		include: ['enrollments'],
		startDate: dateRange && dateRange.startDate && dateRange.startDate.format('YYYY-MM-DD'),
		endDate: dateRange && dateRange.endDate && dateRange.endDate.format('YYYY-MM-DD'),
	});

	useEffect(() => {
		runQuery();
	}, [dateRange]);

	function handlePastEnrollmentsChange() {
		toggleShowPastEnrollments(!showPastEnrollments);
		setByRange(false);
		setDateRange(getDefaultDateRange());
	}

	if (!data) {
		return <div className="Roster"></div>;
	}

  const site = data;
  const enrollments = site.enrollments;

  // TODO: tableprops that don't depend on generated code that we're getting rid of
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
					<td className="oec-table__cell--tabular-nums">
						{row.child.birthdate && dateFormatter(row.child.birthdate)}
					</td>
				),
				sort: row => row.child.birthdate || 0,
			},
			{
				name: 'Funding',
				cell: ({ row }) => (
					<td>
						{row.fundings.length ? (
							<Tag
								text={`${row.fundings[0].source}`}
								color={getColorForFundingSource(row.fundings[0].source)}
							/>
						) : (
							''
						)}
					</td>
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
				<Table {...rosterTableProps} fullWidth />
			</section>
		</div>
	);
}
