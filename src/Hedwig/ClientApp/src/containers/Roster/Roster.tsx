import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import nameFormatter from '../../utils/nameFormatter';
import dateFormatter from '../../utils/dateFormatter';
import enrollmentTextFormatter from '../../utils/enrollmentTextFormatter';
import getDefaultDateRange from '../../utils/getDefaultDateRange';
import getColorForFundingSource, { fundingSourceDetails } from '../../utils/getColorForFundingType';
import getFundingSpaceCapacity from '../../utils/getFundingSpaceCapacity';
import getIdForUser from '../../utils/getIdForUser';
import missingInformation from '../../utils/missingInformation';
import { Table, TableProps } from '../../components/Table/Table';
import Tag from '../../components/Tag/Tag';
import { DateRange } from '../../components/DatePicker/DatePicker';
import Button from '../../components/Button/Button';
import RadioGroup from '../../components/RadioGroup/RadioGroup';
import Legend, { LegendItem } from '../../components/Legend/Legend';
import useApi from '../../hooks/useApi';
import { Enrollment } from '../../OAS-generated/models/Enrollment';
import DateSelectionForm from './DateSelectionForm';
import { Age, FundingSource } from '../../OAS-generated';
import InlineIcon from '../../components/InlineIcon/InlineIcon';
import pluralize from 'pluralize';
import idx from 'idx';
import UserContext from '../../contexts/User/UserContext';

export default function Roster() {
	const [showPastEnrollments, toggleShowPastEnrollments] = useState(false);
	const [dateRange, setDateRange] = useState<DateRange>(getDefaultDateRange());
	const [byRange, setByRange] = useState(false);
	const handlePastEnrollmentsChange = () => {
		toggleShowPastEnrollments(!showPastEnrollments);
		setByRange(false);
		setDateRange(getDefaultDateRange());
	};

	const { user } = useContext(UserContext);
	const siteParams = {
		id: getIdForUser(user, 'site'),
		orgId: getIdForUser(user, 'org'),
		include: ['organizations', 'funding_spaces'],
	};
	const [sLoading, sError, site] = useApi(api => api.apiOrganizationsOrgIdSitesIdGet(siteParams), [
		user,
	]);

	const enrollmentsParams = {
		orgId: getIdForUser(user, 'org'),
		siteId: getIdForUser(user, 'site'),
		include: ['child', 'fundings'],
		startDate: (dateRange && dateRange.startDate && dateRange.startDate.toDate()) || undefined,
		endDate: (dateRange && dateRange.endDate && dateRange.endDate.toDate()) || undefined,
	};
	const [eLoading, eError, enrollments] = useApi(
		api => api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsGet(enrollmentsParams),
		[user, dateRange]
	);

	if (sLoading || sError || !site || eLoading || eError || !enrollments) {
		return <div className="Roster"></div>;
	}

	const defaultRosterTableProps: TableProps<Enrollment> = {
		id: 'roster-table',
		data: [],
		rowKey: row => row.id,
		columns: [
			{
				name: 'Name',
				cell: ({ row }) => (
					<th scope="row">
						<Link to={`/roster/enrollments/${row.id}/`} className="usa-link">
							{nameFormatter(row.child)}
							{missingInformation(row) ? InlineIcon({ icon: 'incomplete' }) : ''}
						</Link>
					</th>
				),
				sort: row => (row.child && row.child.lastName ? row.child.lastName : ''),
			},
			{
				name: 'Birthdate',
				cell: ({ row }) =>
					(row.child && (
						<td className="oec-table__cell--tabular-nums">
							{row.child.birthdate && dateFormatter(row.child.birthdate)}
						</td>
					)) || <></>,
				sort: row => ((row.child && row.child.birthdate) || new Date(0)).getTime(),
			},
			{
				name: 'Funding',
				cell: ({ row }) => (
					<td>
						{row.fundings && row.fundings.length
							? row.fundings.map(funding => (
									<Tag
										key={`${funding.source}-${funding.time}`}
										text={
											funding.source
												? fundingSourceDetails[funding.source].textFormatter(funding)
												: ''
										}
										color={funding.source ? getColorForFundingSource(funding.source) : 'gray-90'}
									/>
							  ))
							: ''}
					</td>
				),
				sort: row => idx(row, _ => _.fundings[0].source) || '',
			},
			{
				name: 'Enrollment date',
				cell: ({ row }) => (
					<td className="oec-table__cell--tabular-nums">
						{row.entry
							? dateFormatter(row.entry) + (row.exit ? `–${dateFormatter(row.exit)}` : '')
							: ''}
					</td>
				),
				sort: row => (row.entry && row.entry.toString()) || '',
			},
		],
		defaultSortColumn: 0,
		defaultSortOrder: 'ascending',
	};

	const incompleteEnrollments = enrollments.filter(e => !e.age || !e.entry);
	const completeEnrollments = enrollments.filter(e => !incompleteEnrollments.includes(e));

	const infantRosterTableProps: TableProps<Enrollment> = {
		...defaultRosterTableProps,
		id: 'infant-roster-table',
		data: completeEnrollments.filter(e => e.age === Age.Infant),
	};
	const preschoolRosterTableProps: TableProps<Enrollment> = {
		...defaultRosterTableProps,
		id: 'preschool-roster-table',
		data: completeEnrollments.filter(e => e.age === Age.Preschool),
	};
	const schoolRosterTableProps: TableProps<Enrollment> = {
		...defaultRosterTableProps,
		id: 'school-roster-table',
		data: completeEnrollments.filter(e => e.age === Age.School),
	};
	const incompleteRosterTableProps: TableProps<Enrollment> = {
		...defaultRosterTableProps,
		id: 'incomplete-roster-table',
		data: incompleteEnrollments.filter(e => !e.age),
	};

	const numKidsEnrolledText = enrollmentTextFormatter(
		enrollments.length,
		showPastEnrollments,
		dateRange,
		byRange
	);

	const legendItems: LegendItem[] = Object.keys(fundingSourceDetails).map(source => {
		const ratioLegendSources: string[] = [FundingSource.CDC];
		const capacityForFunding = getFundingSpaceCapacity(site.organization, source);
		const enrolledForFunding = enrollments.filter(
			e => e.fundings && e.fundings.filter(f => f.source === source).length > 0
		).length;

		// If funding source enrollments should be displayed as a ratio,
		// and capacity info for funding source exists,
		// set ratio to enrollments/capacity. Otherwise: undefined
		const enrolledOverCapacity =
			ratioLegendSources.includes(source) && capacityForFunding
				? { a: enrolledForFunding, b: capacityForFunding }
				: undefined;

		return {
			text: fundingSourceDetails[source].fullTitle,
			symbol: <Tag text={source} color={fundingSourceDetails[source].colorToken} />,
			number: enrolledForFunding,
			ratio: enrolledOverCapacity,
		};
	});

	legendItems.push({
		text: 'Missing information',
		symbol: <InlineIcon icon="incomplete" />,
	});

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
									showPastEnrollments ? 'View only current enrollments' : 'View past enrollments'
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
				<Legend items={legendItems} />
				{!!infantRosterTableProps.data.length && (
					<>
						<h2>Infant/toddler ({pluralize('child', infantRosterTableProps.data.length, true)})</h2>
						<Table {...infantRosterTableProps} fullWidth />
					</>
				)}
				{!!preschoolRosterTableProps.data.length && (
					<>
						<h2>Preschool ({pluralize('child', preschoolRosterTableProps.data.length, true)})</h2>
						<Table {...preschoolRosterTableProps} fullWidth />
					</>
				)}
				{!!schoolRosterTableProps.data.length && (
					<>
						<h2>School age ({pluralize('child', schoolRosterTableProps.data.length, true)})</h2>
						<Table {...schoolRosterTableProps} fullWidth />
					</>
				)}
				{!!incompleteRosterTableProps.data.length && (
					<>
						<h2>
							Incomplete enrollments (
							{pluralize('child', incompleteRosterTableProps.data.length, true)})
						</h2>
						<Table {...incompleteRosterTableProps} fullWidth />
					</>
				)}
			</section>
		</div>
	);
}
