import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import idx from 'idx';
import nameFormatter from '../../utils/nameFormatter';
import dateFormatter from '../../utils/dateFormatter';
import enrollmentTextFormatter from '../../utils/enrollmentTextFormatter';
import getDefaultDateRange from '../../utils/getDefaultDateRange';
import getColorForFundingSource, { fundingSourceDetails } from '../../utils/getColorForFundingType';
import { Table, TableProps } from '../../components/Table/Table';
import Tag from '../../components/Tag/Tag';
import { DateRange } from '../../components/DatePicker/DatePicker';
import Button from '../../components/Button/Button';
import RadioGroup from '../../components/RadioGroup/RadioGroup';
import Legend from '../../components/Legend/Legend';
import useApi from '../../hooks/useApi';
import UserContext from '../../contexts/User/UserContext';
import { Enrollment } from '../../OAS-generated/models/Enrollment';
import DateSelectionForm from './DateSelectionForm';

export default function Roster() {
	const [showPastEnrollments, toggleShowPastEnrollments] = useState(false);
	const [dateRange, setDateRange] = useState<DateRange>(getDefaultDateRange());
	const [byRange, setByRange] = useState(false);
	const { user } = useContext(UserContext);
	const [loading, error, site] = useApi(
		api =>
			api.apiOrganizationsOrgIdSitesIdGet({
				// TODO after pilot: don't just grab the first org and site
				orgId: idx(user, _ => _.orgPermissions[0].organization.id) || 0,
				id: idx(user, _ => _.orgPermissions[0].organization.sites[0].id) || 0,
			}),
		[user]
  );
  
  	const [enrollmentsLoading, enrollmentsError, rawEnrollments] = useApi(
			// TODO: after everything being nullable is solved, ditch raw enrollments and type mapping below
			api =>
				api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsGet({
					// TODO after pilot: don't just grab the first org and site
					orgId: idx(user, _ => _.orgPermissions[0].organization.id) || 0,
					siteId: idx(user, _ => _.orgPermissions[0].organization.sites[0].id) || 0,
					include: ['child', 'fundings'],
					startDate:
						(dateRange && dateRange.startDate && dateRange.startDate.toDate()) ||
						undefined,
					endDate:
						(dateRange && dateRange.endDate && dateRange.endDate.toDate()) ||
						undefined,
				}),
			[user, dateRange]
		);

	function handlePastEnrollmentsChange() {
		toggleShowPastEnrollments(!showPastEnrollments);
		setByRange(false);
		setDateRange(getDefaultDateRange());
	}

	if (!site) {
		return <div className="Roster"></div>;
  }
  
	// TODO: FIX THIS-- ditch raw enrollments
	const enrollments = (rawEnrollments || []).map(e => e as Required<Enrollment>);

	const rosterTableProps: TableProps<Required<Enrollment>> = {
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
				sort: row => (row.child.birthdate || new Date(0)).getTime(),
			},
			{
				name: 'Funding',
				cell: ({ row }) => (
					<td>
						{row.fundings && row.fundings.length ? (
							<Tag
								text={`${row.fundings[0].source}`}
								color={
									row.fundings[0].source
										? getColorForFundingSource(row.fundings[0].source)
										: 'gray-90'
								}
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
				sort: row => (row.entry && row.entry.toString()) || '',
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
			(row: Required<Enrollment>) =>
				row.fundings && row.fundings.filter((funding: any) => funding.source === key).length > 0
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
