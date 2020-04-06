import React from 'react';
import idx from 'idx';
import pluralize from 'pluralize';
import { Link } from 'react-router-dom';
import { Table, TableProps, InlineIcon, DateRange, Column } from '../../components';
import { Enrollment, FundingSpace, FundingSource, Organization } from '../../generated';
import { lastFirstNameFormatter } from '../../utils/stringFormatters';
import dateFormatter from '../../utils/dateFormatter';
import { NO_FUNDING, getFundingSpaceTime, prettyFundingTime } from '../../utils/models';
import { DeepNonUndefineable, DeepNonUndefineableArray } from '../../utils/types';
import { hasValidationErrors } from '../../utils/validations';
import { isFunded } from '../../utils/models';
import {
	generateFundingTypeTag,
	filterFundingTypesForRosterTags,
	FundingType,
} from '../../utils/fundingType';

export type AgeGroupTableProps = { id: string; data: DeepNonUndefineable<Enrollment>[] };

type AgeGroupSectionProps = {
	organization: Organization;
	ageGroup: string;
	ageGroupTitle: string;
	enrollments: DeepNonUndefineableArray<Enrollment>;
	fundingSpaces?: FundingSpace[];
	rosterDateRange?: DateRange;
	showPastEnrollments?: boolean;
};

export default function AgeGroupSection({
	organization,
	ageGroup,
	ageGroupTitle,
	enrollments,
	fundingSpaces,
	rosterDateRange,
	showPastEnrollments,
}: AgeGroupSectionProps) {
	if (!enrollments.length) return null;

	const columns: Column<DeepNonUndefineable<Enrollment>>[] = [];
	const nameColumn = {
		name: 'Name',
		cell: ({ row }: { row: DeepNonUndefineable<Enrollment> }) => (
			<th scope="row">
				<Link to={`/roster/sites/${row.siteId}/enrollments/${row.id}/`} className="usa-link print">
					{lastFirstNameFormatter(row.child)}
				</Link>
				&nbsp;
				{isFunded(row, { source: FundingSource.CDC }) && hasValidationErrors(row)
					? InlineIcon({ icon: 'incomplete' })
					: ''}
			</th>
		),
		sort: (row: Enrollment) => lastFirstNameFormatter(row.child).toLowerCase(),
		width: '25%',
	};

	const birthdateColumn = {
		name: 'Birthdate',
		cell: ({ row }: { row: DeepNonUndefineable<Enrollment> }) =>
			(row.child && (
				<td className="oec-table__cell--tabular-nums">
					{row.child.birthdate && dateFormatter(row.child.birthdate)}
				</td>
			)) || <></>,
		sort: (row: Enrollment) => ((row.child && row.child.birthdate) || new Date(0)).getTime(),
		width: '20%',
	};

	const fundingColumn = {
		name: 'Funding',
		cell: ({ row }: { row: DeepNonUndefineable<Enrollment> }) => {
			const fundings = (row.fundings || []).map(funding => ({ ...funding, type: 'CDC' as 'CDC' }));
			const certificates = (row.child.c4KCertificates || []).map(certificate => ({
				...certificate,
				type: 'C4K' as 'C4K',
			}));
			const fundingTypes: FundingType[] = [...fundings, ...certificates];
			const fundingTypeTags = filterFundingTypesForRosterTags(fundingTypes, rosterDateRange);
			return (
				<td>
					{fundingTypeTags.length > 0 ? (
						fundingTypeTags.map<React.ReactNode>((value, index) =>
							generateFundingTypeTag(value, { index, includeTime: true })
						)
					) : (
						<span className="text-italic text-base">{NO_FUNDING}</span>
					)}
				</td>
			);
		},
		sort: (row: Enrollment) => idx(row, _ => _.fundings[0].source) || '',
		width: '20%',
	};

	const siteColumn = {
		name: 'Site',
		cell: ({ row }: { row: DeepNonUndefineable<Enrollment> }) => <td>{row.site.name}</td>,
		sort: (row: DeepNonUndefineable<Enrollment>) => (row.site.name || '').toLowerCase(),
		width: '15%',
	};

	const enrollmentDateColumn = {
		name: 'Enrollment date',
		cell: ({ row }: { row: DeepNonUndefineable<Enrollment> }) => (
			<td className="oec-table__cell--tabular-nums">
				{row.entry
					? dateFormatter(row.entry) + (row.exit ? `–${dateFormatter(row.exit)}` : '')
					: ''}
			</td>
		),
		sort: (row: DeepNonUndefineable<Enrollment>) => (row.entry && row.entry.toString()) || '',
		width: '20%',
	};

	columns.push(nameColumn);
	columns.push(birthdateColumn);
	columns.push(fundingColumn);
	// Only show the site column if it exists (more than one site)
	if (organization.sites && organization.sites.length > 1) {
		columns.push(siteColumn);
	}
	columns.push(enrollmentDateColumn);

	const rosterTableProps: TableProps<DeepNonUndefineable<Enrollment>> = {
		id: `${ageGroup}-roster-table`,
		data: enrollments,
		rowKey: row => row.id,
		columns: columns,
		defaultSortColumn: 0,
		defaultSortOrder: 'ascending',
	};

	return (
		<>
			<h2 className="margin-top-6">
				{`${ageGroupTitle} (${pluralize('child', rosterTableProps.data.length, true)})`}
			</h2>
			{fundingSpaces && (
				<ul>
					{fundingSpaces.map(space => {
						const enrolledForFunding = enrollments.filter<DeepNonUndefineable<Enrollment>>(
							enrollment =>
								isFunded(enrollment, {
									source: space.source,
									time: getFundingSpaceTime(space),
									currentRange: rosterDateRange,
								})
						).length;

						return (
							<li key={`${getFundingSpaceTime(space)}-${ageGroupTitle}`}>
								<span className="text-bold">
									{showPastEnrollments
										? enrolledForFunding
										: `${enrolledForFunding}/${space.capacity}`}
								</span>
								<span>
									{showPastEnrollments
										? ` in ${prettyFundingTime(getFundingSpaceTime(space))} ${space.source || ''} spaces`
										: ` ${prettyFundingTime(getFundingSpaceTime(space))} ${space.source || ''} spaces filled`
									}
								</span>
							</li>
						);
					})}
				</ul>
			)}
			<Table {...rosterTableProps} fullWidth />
		</>
	);
}
