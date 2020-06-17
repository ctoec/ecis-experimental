import React from 'react';
import pluralize from 'pluralize';
import { Table, TableProps, DateRange, Column, Legend } from '../../../../components';
import { Enrollment, FundingSpace, Organization, Site } from '../../../../generated';
import { isFundedForFundingSpace, prettyFundingSpaceTime } from '../../../../utils/models';
import { legendDisplayDetails } from '../../../../utils/legendFormatters';
import { ReportFundingColumn } from '../../../RosterColumns/ReportFundingColumn';
import { NameColumn } from '../../../RosterColumns/NameColumn';
import { BirthdateColumn } from '../../../RosterColumns/BirthDateColumn';
import { SiteColumn } from '../../../RosterColumns/SiteColumn';
import { EnrolledOnColumn } from '../../../RosterColumns/EnrolledOnColumn';

export type AgeGroupTableProps = {
	id: string;
	data: Enrollment[];
};

type AgeGroupSectionProps = {
	organization: Organization;
	ageGroup: string;
	ageGroupTitle: string;
	enrollments: Enrollment[];
	site: Site | null;
	fundingSpaces?: FundingSpace[];
	rosterDateRange?: DateRange;
	showPastEnrollments?: boolean;
};

export const AgeGroupSection: React.FC<AgeGroupSectionProps> = ({
	organization,
	site,
	ageGroup,
	ageGroupTitle,
	enrollments,
	fundingSpaces,
	rosterDateRange,
	showPastEnrollments,
}) => {
	// If we're looking at an org roster, there is a funding spaces array (i.e. it's not the incomplete section), and there are no funding spaces for this age group
	// OR if it's a site view and there are no enrollments for this age group, don't show it
	if ((site && !enrollments.length) || (fundingSpaces && !fundingSpaces.length)) return null;
	// If we're looking at the organization roster, or if there are any funding spaces for this age group, at least show the header

	let columns: Column<Enrollment>[] = [];
	// Only show the site column if we're in multi-site view,
	// and it exists (more than one site)
	if (!site && organization.sites && organization.sites.length > 1) {
		columns = [
			NameColumn(25),
			BirthdateColumn(17),
			ReportFundingColumn(rosterDateRange, 18),
			SiteColumn(20),
			EnrolledOnColumn(20),
		];
	} else {
		columns = [
			NameColumn(30),
			BirthdateColumn(22),
			ReportFundingColumn(rosterDateRange, 23),
			EnrolledOnColumn(25),
		];
	}

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
			symbol: legendDisplayDetails[space.source || ''].symbolGenerator({
				fundingTime: space.time,
				forReport: true,
			}),
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
};
