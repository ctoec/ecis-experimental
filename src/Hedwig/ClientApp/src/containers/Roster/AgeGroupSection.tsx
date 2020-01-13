import React from 'react';
import idx from 'idx';
import pluralize from 'pluralize';
import { Link } from 'react-router-dom';
import { Table, TableProps, InlineIcon } from '../../components';
import { Enrollment, Funding, FundingSpace, FundingSource } from '../../generated';
import { lastFirstNameFormatter } from '../../utils/nameFormatter';
import dateFormatter from '../../utils/dateFormatter';
import { generateFundingTag, isCurrent, NO_FUNDING } from '../../utils/models';
import { DeepNonUndefineable, DeepNonUndefineableArray } from '../../utils/types';
import { hasValidationErrors } from '../../utils/validations';
import { isFunded } from '../../utils/models';

export type AgeGroupTableProps = { id: string; data: DeepNonUndefineable<Enrollment>[] };

type AgeGroupSectionProps = {
	ageGroup: string;
	ageGroupTitle: string;
	enrollments: DeepNonUndefineableArray<Enrollment>;
	fundingSpaces?: FundingSpace[];
};

const defaultRosterTableProps: TableProps<DeepNonUndefineable<Enrollment>> = {
	id: 'roster-table',
	data: [],
	rowKey: row => row.id,
	columns: [
		{
			name: 'Name',
			cell: ({ row }) => (
				<th scope="row">
					<Link to={`/roster/enrollments/${row.id}/`} className="usa-link print">
						{lastFirstNameFormatter(row.child)}
					</Link>
					&nbsp;
					{(isFunded(row, { source: FundingSource.CDC, current: true }) && hasValidationErrors(row)) ? InlineIcon({ icon: 'incomplete' }) : ''}
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
					{row.fundings && row.fundings.length > 0 ?
						row.fundings
						.filter(funding => isCurrent(funding))
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

export default function AgeGroupSection({
	ageGroup,
	ageGroupTitle,
	enrollments,
	fundingSpaces,
}: AgeGroupSectionProps) {
	if (!enrollments.length) return null;
	const tableProps = Object.assign({}, defaultRosterTableProps, {
		id: `${ageGroup}-roster-table`,
		data: enrollments,
	});

	return (
		<>
			<h2 className="margin-top-6">
				{`${ageGroupTitle} (${pluralize('child', tableProps.data.length, true)})`}
			</h2>
			{fundingSpaces && (
				<ul>
					{fundingSpaces.map(space => {
						const enrolledForFunding = enrollments.filter<DeepNonUndefineable<Enrollment>>(
							enrollment => isFunded(enrollment, { source: space.source, time: space.time })
							).length

						return (
							<li key={`${space.time}-${ageGroupTitle}`}>
								<span className="text-bold">
									{`${enrolledForFunding}/${space.capacity}`}
								</span>
								<span>
									{` ${(space.time || '').toLowerCase()} time ${(space.source || '')} `}
									spaces filled
								</span>
							</li>
						)
					})}
				</ul>
			)}
			<Table {...tableProps} fullWidth />
		</>
	);
}
