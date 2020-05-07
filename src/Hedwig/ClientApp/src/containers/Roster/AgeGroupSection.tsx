import React from 'react';
import idx from 'idx';
import pluralize from 'pluralize';
import { Link } from 'react-router-dom';
import { Table, TableProps, InlineIcon, DateRange, Column, Legend } from '../../components';
import { Enrollment, FundingSpace, FundingSource, Organization, Site } from '../../generated';
import { lastFirstNameFormatter } from '../../utils/stringFormatters';
import dateFormatter from '../../utils/dateFormatter';
import { NO_FUNDING, isFundedForFundingSpace, prettyFundingSpaceTime } from '../../utils/models';
import { DeepNonUndefineable, DeepNonUndefineableArray } from '../../utils/types';
import { hasValidationErrors } from '../../utils/validations';
import { isFunded } from '../../utils/models';
import {
	generateFundingTypeTag,
	filterFundingTypesForRosterTags,
	FundingType,
} from '../../utils/fundingType';
import { legendDisplayDetails } from '../../utils/legendFormatters';

export type AgeGroupTableProps = { id: string; data: DeepNonUndefineable<Enrollment>[] };

type AgeGroupSectionProps = {
	organization: Organization;
	ageGroup: string;
	ageGroupTitle: string;
	enrollments: DeepNonUndefineableArray<Enrollment>;
	site?: Site;
	fundingSpaces?: DeepNonUndefineableArray<FundingSpace>;
	rosterDateRange?: DateRange;
	showPastEnrollments?: boolean;
};

export default function AgeGroupSection({
	organization,
	site,
	ageGroup,
	ageGroupTitle,
	enrollments,
	fundingSpaces,
	rosterDateRange,
	showPastEnrollments,
}: AgeGroupSectionProps) {
	// If we're looking at an org roster, there is a funding spaces array (i.e. it's not the incomplete section), and there are no funding spaces for this age group
	// OR if it's a site view and there are no enrollments for this age group, don't show it
	if ((site && !enrollments.length) || (fundingSpaces && !fundingSpaces.length)) return null;
	// If we're looking at the organization roster, or if there are any funding spaces for this age group, at least show the header

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
						fundingTypeTags.map<React.ReactNode>((value, index) => {
							let includeTime = false;
							const fundingSpaces = organization.fundingSpaces;
							if (fundingSpaces) {
								const matchingFundingSpaces = fundingSpaces
									.filter(space => space.source === value.type)
									.filter(space => space.ageGroup === ageGroup);
								if (matchingFundingSpaces.length > 1) {
									includeTime = true;
								}
							}
							return generateFundingTypeTag(value, { index, includeTime });
						})
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
		cell: ({ row }: { row: DeepNonUndefineable<Enrollment> }) => (
			<td className="ellipsis-wrap-text ellipsis-wrap-text--tight">{row.site.name}</td>
		),
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
	// Only show the site column if we're in multi-site view,
	// and it exists (more than one site)
	if (!site && organization.sites && organization.sites.length > 1) {
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

	// One legend item per funding space of a given age group
	const legendItems = (fundingSpaces || []).map(space => {
		const enrolledForFundingSpace = enrollments.filter<DeepNonUndefineable<Enrollment>>(
			enrollment => isFundedForFundingSpace(enrollment, space.id, rosterDateRange)
		).length;
		const fundingTime = prettyFundingSpaceTime(space);
		return {
			symbol: legendDisplayDetails[space.source || ''].symbol,
			hidden: site && enrolledForFundingSpace === 0,
			// If we're looking at an org roster, show the funding spaces available even if they're not used
			// Hide the legend item if there are no kids enrolled for this funding space type and we are looking at one site
			text: (
				<>
					<span>
						{fundingTime}
						{' — '}
					</span>
					<span className="text-bold">
						{/* If past enrollments or site, only show number of spaces filled, not ratio for entire organization */}
						{showPastEnrollments || site
							? enrolledForFundingSpace
							: `${enrolledForFundingSpace}/${space.capacity}`}
					</span>
					<span> spaces filled</span>
				</>
			),
		};
	});

	return (
		<>
			<h2 className="margin-top-6">
				{`${ageGroupTitle} (${pluralize('child', rosterTableProps.data.length, true)})`}
			</h2>
			<Legend items={legendItems} vertical />
			<Table {...rosterTableProps} fullWidth />
		</>
	);
}
