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
import Tag, { TagProps } from '../../components/Tag/Tag';
import { DateRange } from '../../components/DatePicker/DatePicker';
import Button from '../../components/Button/Button';
import RadioGroup from '../../components/RadioGroup/RadioGroup';
import Legend, { LegendItem } from '../../components/Legend/Legend';
import useApi from '../../hooks/useApi';
import { Enrollment } from '../../generated/models/Enrollment';
import DateSelectionForm from './DateSelectionForm';
import { Age, FundingSource, Funding } from '../../generated';
import InlineIcon from '../../components/InlineIcon/InlineIcon';
import pluralize from 'pluralize';
import idx from 'idx';
import UserContext from '../../contexts/User/UserContext';
import { DeepNonUndefineable } from '../../utils/types';

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
	const [siteLoading, siteError, site] = useApi(api => api.apiOrganizationsOrgIdSitesIdGet(siteParams), [
		user,
	]);

	const enrollmentsParams = {
		orgId: getIdForUser(user, 'org'),
		siteId: getIdForUser(user, 'site'),
		include: ['child', 'fundings'],
		startDate: (dateRange && dateRange.startDate && dateRange.startDate.toDate()) || undefined,
		endDate: (dateRange && dateRange.endDate && dateRange.endDate.toDate()) || undefined,
	};
	const [enrollmentLoading, enrollmentError, enrollments] = useApi(
		api => api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsGet(enrollmentsParams),
		[user, dateRange]
	);

	if (siteLoading || siteError || !site || enrollmentLoading || enrollmentError || !enrollments) {
		return <div className="Roster"></div>;
	}

	const defaultRosterTableProps: TableProps<DeepNonUndefineable<Enrollment>> = {
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
				cell: ({ row }) => {
					const fundings = row.fundings && row.fundings.length
						? row.fundings.map<React.ReactNode>(funding =>
							<Tag
								key={`${funding.source}-${funding.time}`}
								text={
									funding.source
										? fundingSourceDetails[funding.source].textFormatter(funding)
										: ''
								}
								color={funding.source ? getColorForFundingSource(funding.source) : 'gray-90'}
							/>)
						: '';
					return (
						<td>
							{fundings}
						</td>
					);
				},
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

	const incompleteEnrollments = enrollments.filter<DeepNonUndefineable<Enrollment>>(
		(e => !e.age || !e.entry) as (_: DeepNonUndefineable<Enrollment>) => _ is DeepNonUndefineable<Enrollment>
	);
	const completeEnrollments = enrollments.filter<DeepNonUndefineable<Enrollment>>(
		(e => !incompleteEnrollments.includes(e)) as (_: DeepNonUndefineable<Enrollment>) => _ is DeepNonUndefineable<Enrollment>
	);

	function isInfant(enrollment: DeepNonUndefineable<Enrollment>): enrollment is DeepNonUndefineable<Enrollment> {
		return enrollment.age === Age.Infant;
	}

	function isPreschool(enrollment: DeepNonUndefineable<Enrollment>): enrollment is DeepNonUndefineable<Enrollment> {
		return enrollment.age === Age.Preschool;
	}

	function isSchool(enrollment: DeepNonUndefineable<Enrollment>): enrollment is DeepNonUndefineable<Enrollment> {
		return enrollment.age === Age.School;
	}

	function isAgeIncomplete(enrollment: DeepNonUndefineable<Enrollment>): enrollment is DeepNonUndefineable<Enrollment> {
		return !enrollment.age;
	}

	const infantRosterTableProps: TableProps<DeepNonUndefineable<Enrollment>> = {
		...defaultRosterTableProps,
		id: 'infant-roster-table',
		data: completeEnrollments.filter<DeepNonUndefineable<Enrollment>>(isInfant),
	};
	const preschoolRosterTableProps: TableProps<DeepNonUndefineable<Enrollment>> = {
		...defaultRosterTableProps,
		id: 'preschool-roster-table',
		data: completeEnrollments.filter<DeepNonUndefineable<Enrollment>>(isPreschool),
	};
	const schoolRosterTableProps: TableProps<DeepNonUndefineable<Enrollment>> = {
		...defaultRosterTableProps,
		id: 'school-roster-table',
		data: completeEnrollments.filter<DeepNonUndefineable<Enrollment>>(isSchool),
	};
	const incompleteRosterTableProps: TableProps<DeepNonUndefineable<Enrollment>> = {
		...defaultRosterTableProps,
		id: 'incomplete-roster-table',
		data: incompleteEnrollments.filter<DeepNonUndefineable<Enrollment>>(isAgeIncomplete),
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
		function isEnrolledForFunding(enrollment: DeepNonUndefineable<Enrollment>): enrollment is DeepNonUndefineable<Enrollment> {
			const matchesSource = (funding: DeepNonUndefineable<Funding>): funding is DeepNonUndefineable<Funding> => {
				return funding.source === source;
			}
			return enrollment.fundings ? enrollment.fundings.filter<DeepNonUndefineable<Funding>>(matchesSource).length > 0 : false;
		}
		const enrolledForFunding = enrollments.filter<DeepNonUndefineable<Enrollment>>(isEnrolledForFunding).length;

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
				<div className="grid-row flex-first-baseline flex-space-between">
					<h1 className="tablet:grid-col-auto">{site.name}</h1>
					<div className="tablet:grid-col-auto">
						<Button text="Enroll child" href={`/roster/sites/${site.id}/enroll`} />
					</div>
				</div>
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
