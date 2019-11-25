import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import nameFormatter from '../../utils/nameFormatter';
import dateFormatter from '../../utils/dateFormatter';
import enrollmentTextFormatter from '../../utils/enrollmentTextFormatter';
import getDefaultDateRange from '../../utils/getDefaultDateRange';
import { Table, TableProps } from '../../components/Table/Table';
import Tag from '../../components/Tag/Tag';
import { DateRange } from '../../components/DatePicker/DatePicker';
import Button from '../../components/Button/Button';
import RadioGroup from '../../components/RadioGroup/RadioGroup';
import Legend from '../../components/Legend/Legend';
import DateSelectionForm from './DateSelectionForm';
import getColorForFundingSource, { fundingSourceDetails } from '../../utils/getColorForFundingType';
import useOASClient from '../../hooks/useOASClient';
import UserContext from '../../contexts/User/UserContext';
import { Age } from '../../OAS-generated/models/Age';
import { Child } from '../../OAS-generated/models/Child';
import { Funding } from '../../OAS-generated/models/Funding';

type RosterTableProps = {
	id: number;
	entry: OECDate | null;
	exit: OECDate | null;
	age: Age | null;
	child: Child;
	fundings: Funding[];
};

export default function Roster() {
	const [showPastEnrollments, toggleShowPastEnrollments] = useState(false);
	const [dateRange, setDateRange] = useState<DateRange>(getDefaultDateRange());
	const [byRange, setByRange] = useState(false);
	const { user } = useContext(UserContext);
	const data = useOASClient('organizationsOrganizationIdSitesSiteIdGet', {
		organizationId: (user && user.organizationId) || 0,
		// TODO after pilot: don't just grab the first siteId
		siteId: (user && user.siteIds && user.siteIds[0]) || 0,
    include: ['enrollments'],
    // TODO: extract this into a function
		startDate: dateRange && dateRange.startDate && dateRange.startDate.format('YYYY-MM-DD'),
		endDate: dateRange && dateRange.endDate && dateRange.endDate.format('YYYY-MM-DD'),
	});

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

	const rosterTableProps: TableProps<RosterTableProps> = {
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

	const legendItems = Object.keys(fundingSourceDetails).map(key => ({
		text: fundingSourceDetails[key].fullTitle,
		symbolColor: fundingSourceDetails[key].colorToken,
		number: enrollments.filter(
			(row: RosterTableProps) =>
				row.fundings.filter((funding: any) => funding.source === key).length > 0
		).length,
	}));

	return (
		<div className="Roster">
			<section className="grid-container">
				<h1 className="grid-col-auto">{site.name}</h1>
				<Legend items={legendItems} />
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
