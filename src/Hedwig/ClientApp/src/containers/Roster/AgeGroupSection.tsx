import React from 'react';
import idx from 'idx';
import pluralize from 'pluralize';
import { Link } from 'react-router-dom';
import { Table, TableProps, InlineIcon, DateRange } from '../../components';
import { Enrollment, Funding, FundingSpace, FundingSource } from '../../generated';
import { lastFirstNameFormatter } from '../../utils/nameFormatter';
import dateFormatter from '../../utils/dateFormatter';
import { generateFundingTag, NO_FUNDING, filterFundingsForRosterTags } from '../../utils/models';
import { DeepNonUndefineable, DeepNonUndefineableArray } from '../../utils/types';
import { hasValidationErrors } from '../../utils/validations';
import { isFunded } from '../../utils/models';

export type AgeGroupTableProps = { id: string; data: DeepNonUndefineable<Enrollment>[] };

type AgeGroupSectionProps = {
	siteId: number;
	ageGroup: string;
	ageGroupTitle: string;
	enrollments: DeepNonUndefineableArray<Enrollment>;
	fundingSpaces?: FundingSpace[];
	rosterDateRange?: DateRange;
	showPastEnrollments?: boolean;
};

export default function AgeGroupSection({
	siteId,
	ageGroup,
	ageGroupTitle,
	enrollments,
	fundingSpaces,
	rosterDateRange,
	showPastEnrollments
}: AgeGroupSectionProps) {
	if (!enrollments.length) return null;

	const rosterTableProps: TableProps<DeepNonUndefineable<Enrollment>> = {
		id: `${ageGroup}-roster-table`,
		data: enrollments,
		rowKey: row => row.id,
		columns: [
			{
				name: 'Name',
				cell: ({ row }) => (
					<th scope="row">
						<Link to={`/roster/sites/${siteId}/enrollments/${row.id}/`} className="usa-link print">
							{lastFirstNameFormatter(row.child)}
						</Link>
						&nbsp;
						{(isFunded(row, { source: FundingSource.CDC }) && hasValidationErrors(row)) ? InlineIcon({ icon: 'incomplete' }) : ''}
					</th>
				),
				sort: row => lastFirstNameFormatter(row.child),
				width: "35%",
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
				width: "20%",
			},
			{
				name: 'Funding',
				cell: ({ row }) => (
					<td>
						{filterFundingsForRosterTags(row.fundings, rosterDateRange).length > 0
						? (filterFundingsForRosterTags(row.fundings, rosterDateRange) as DeepNonUndefineable<Funding[]>)
							.map<React.ReactNode>((funding: DeepNonUndefineable<Funding>, index: number) =>
								generateFundingTag(funding, index)
							) :
							<span className="text-italic text-base">{NO_FUNDING}</span>
						}
					</td>
				),
				sort: row => idx(row, _ => _.fundings[0].source) || '',
				width: "25%",
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
				width: "20%",
			},
		],
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
							enrollment => isFunded(enrollment, { source: space.source, time: space.time, currentRange: rosterDateRange})
							).length

						return (
							<li key={`${space.time}-${ageGroupTitle}`}>
								<span className="text-bold">
									{showPastEnrollments ? enrolledForFunding : `${enrolledForFunding}/${space.capacity}`}
								</span>
								<span>
									{showPastEnrollments 
										? ` in ${(space.time || '').toLowerCase()} time ${(space.source || '')} spaces` 
										: ` ${(space.time || '').toLowerCase()} time ${(space.source || '')} spaces filled`
									} 
								</span>
							</li>
						)
					})}
				</ul>
			)}
			<Table {...rosterTableProps} fullWidth />
		</>
	);
}
