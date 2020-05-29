import React from 'react';
import idx from 'idx';
import pluralize from 'pluralize';
import { Link } from 'react-router-dom';
import { Table, TableProps, InlineIcon, DateRange, Column, Legend } from '../../components';
import { Enrollment, FundingSpace, FundingSource, Organization, Site } from '../../generated';
import { lastFirstNameFormatter } from '../../utils/stringFormatters';
import dateFormatter from '../../utils/dateFormatter';
import {
	NO_FUNDING,
	isFundedForFundingSpace,
	prettyFundingSpaceTime,
	isCurrentToRange,
	dedupeFundings,
	isCurrentToRangeC4K,
} from '../../utils/models';
import { hasValidationErrors } from '../../utils/validations';
import { isFunded } from '../../utils/models';
import { legendDisplayDetails } from '../../utils/legendFormatters';
import { getC4KTag, getFundingTag } from '../../utils/fundingType';

export type AgeGroupTableProps = {
	id: string;
	data: Enrollment[];
};

type AgeGroupSectionProps = {
	organization: Organization;
	ageGroup: string;
	ageGroupTitle: string;
	enrollments: Enrollment[];
	site?: Site;
	fundingSpaces?: FundingSpace[];
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

	const columns: Column<Enrollment>[] = [];
	const nameColumn: Column<Enrollment> = {
		name: 'Name',
		cell: ({ row }) => (
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
		sort: (row) => lastFirstNameFormatter(row.child).toLowerCase(),
		width: '25%',
	};

	const birthdateColumn: Column<Enrollment> = {
		name: 'Birthdate',
		cell: ({ row }) =>
			(row.child && (
				<td className="oec-table__cell--tabular-nums">
					{row.child.birthdate && dateFormatter(row.child.birthdate)}
				</td>
			)) || <></>,
		sort: (row) => ((row.child && row.child.birthdate) || new Date(0)).getTime(),
		width: '17%',
	};

	const fundingColumn: Column<Enrollment> = {
		name: 'Funding',
		cell: ({ row }) => {
			const filteredFundings = dedupeFundings(
				(row.fundings || []).filter((f) => isCurrentToRange(f, rosterDateRange))
			);
			const filteredCertificates = ((row.child && row.child.c4KCertificates) || []).filter((c) =>
				isCurrentToRangeC4K(c, rosterDateRange)
			);

			return (
				<td>
					{filteredFundings.map((funding, index) =>
						getFundingTag({
							fundingSource: funding.source,
							index,
							fundingTime: funding.fundingSpace ? funding.fundingSpace.time : undefined,
						})
					)}
					{filteredCertificates.length > 0 && getC4KTag()}
					{filteredFundings.length === 0 && filteredCertificates.length === 0 && (
						<span className="text-italic text-base">{NO_FUNDING}</span>
					)}
				</td>
			);
		},
		sort: (row) => idx(row, (_) => _.fundings[0].source) || '',
		width: '18%',
	};

	const siteColumn: Column<Enrollment> = {
		name: 'Site',
		cell: ({ row }) => (
			<td
				className="ellipsis-wrap-text ellipsis-wrap-text--tight"
				title={(row.site && row.site.name) || undefined}
			>
				{row.site && row.site.name}
			</td>
		),
		sort: (row) => ((row.site && row.site.name) || '').toLowerCase(),
		width: '20%',
	};

	const enrollmentDateColumn: Column<Enrollment> = {
		name: 'Enrollment date',
		cell: ({ row }) => (
			<td className="oec-table__cell--tabular-nums">
				{row.entry
					? dateFormatter(row.entry) + (row.exit ? `–${dateFormatter(row.exit)}` : '')
					: ''}
			</td>
		),
		sort: (row) => (row.entry && row.entry.toString()) || '',
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

	const rosterTableProps: TableProps<Enrollment> = {
		id: `${ageGroup}-roster-table`,
		data: enrollments,
		rowKey: (row) => row.id,
		columns: columns,
		defaultSortColumn: 0,
		defaultSortOrder: 'ascending',
	};

	// One legend item per funding space of a given age group
	const legendItems = (fundingSpaces || []).map((space) => {
		const enrolledForFundingSpace = enrollments.filter((enrollment) =>
			isFundedForFundingSpace(enrollment, space.id, rosterDateRange)
		).length;
		const prettyFundingTime = prettyFundingSpaceTime(space);
		return {
			symbol: legendDisplayDetails[space.source || ''].symbolGenerator({ fundingTime: space.time }),
			hidden: site && enrolledForFundingSpace === 0,
			// If we're looking at an org roster, show the funding spaces available even if they're not used
			// Hide the legend item if there are no kids enrolled for this funding space type and we are looking at one site
			text: (
				<>
					<span>
						{prettyFundingTime}
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
