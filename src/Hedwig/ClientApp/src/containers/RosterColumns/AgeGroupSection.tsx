import React from 'react';
import pluralize from 'pluralize';
// TODO
import { DateRange } from '../../components';
import { Table, TableProps, Column, Legend } from '@ctoec/component-library';
import { Enrollment, FundingSpace, Site } from '../../generated';
import { generateLegendItems } from '../../utils/rosterLegend';

export type AgeGroupTableProps = {
	id: string;
	data: Enrollment[];
};

type AgeGroupSectionProps = {
	ageGroup: string;
	ageGroupTitle: string;
	enrollments: Enrollment[];
	site: Site | null;
	fundingSpaces?: FundingSpace[];
	rosterDateRange?: DateRange;
	columns: Column<Enrollment>[];
	showPastEnrollments?: boolean;
	forReport: boolean;
};

export const AgeGroupSection: React.FC<AgeGroupSectionProps> = ({
	site,
	ageGroup,
	ageGroupTitle,
	enrollments,
	fundingSpaces,
	rosterDateRange,
	columns,
	showPastEnrollments,
	forReport,
}) => {
	// If we're looking at an org roster, there is a funding spaces array (i.e. it's not the incomplete section), and there are no funding spaces for this age group
	// OR if it's a site view and there are no enrollments for this age group, don't show it
	if ((site && !enrollments.length) || (fundingSpaces && !fundingSpaces.length)) return null;
	// If we're looking at the organization roster, or if there are any funding spaces for this age group, at least show the header

	const rosterTableProps: TableProps<Enrollment> = {
		id: `${ageGroup}-roster-table`,
		data: enrollments,
		rowKey: (row) => row.id,
		columns: columns,
		defaultSortColumn: 0,
		defaultSortOrder: 'ascending',
	};

	const legendItems = generateLegendItems(
		fundingSpaces || [],
		enrollments,
		site,
		rosterDateRange,
		showPastEnrollments,
		forReport
	);

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
