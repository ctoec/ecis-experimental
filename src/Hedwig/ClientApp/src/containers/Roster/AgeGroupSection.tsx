import React from 'react';
import idx from 'idx';
import pluralize from 'pluralize';
import { Link } from 'react-router-dom';
import { Table, TableProps } from '../../components/Table/Table';
import Tag from '../../components/Tag/Tag';
import InlineIcon from '../../components/InlineIcon/InlineIcon';
import { Enrollment, Funding, FundingSpace } from '../../generated';
import { lastFirstNameFormatter } from '../../utils/nameFormatter';
import dateFormatter from '../../utils/dateFormatter';
import getColorForFundingSource, { fundingSourceDetails } from '../../utils/fundingTypeFormatters';
import { DeepNonUndefineable } from '../../utils/types';
import { hasValidationErrors } from '../../utils/validations';

export type AgeGroupTableProps = { id: string; data: DeepNonUndefineable<Enrollment>[] };

type AgeGroupSectionProps = {
	ageGroup: string;
	ageGroupTitle: string;
	enrollments: DeepNonUndefineable<Enrollment>[];
	fundingSpaces?: FundingSpace[];
};

function generateFundingTag(funding: DeepNonUndefineable<Funding>): JSX.Element {
	return (
		<Tag
			key={`${funding.source}-${funding.time}`}
			text={funding.source ? fundingSourceDetails[funding.source].tagFormatter(funding) : ''}
			color={funding.source ? getColorForFundingSource(funding.source) : 'gray-90'}
		/>
	);
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
						{lastFirstNameFormatter(row.child)}
					</Link>
					&nbsp;
					{hasValidationErrors(row) ? InlineIcon({ icon: 'incomplete' }) : ''}
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
					{row.fundings &&
						row.fundings.map<React.ReactNode>((funding: DeepNonUndefineable<Funding>) =>
							generateFundingTag(funding)
						)}
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
					{fundingSpaces.map(space => (
						<li key={`${space.time}-${ageGroupTitle}`}>
							<span className="text-bold">
								{`${tableProps.data.length}/${space.capacity} ${(
									space.time || ''
								).toLowerCase()} time`}
							</span>
							<span>{` ${ageGroupTitle.toLowerCase()} spaces filled`}</span>
						</li>
					))}
				</ul>
			)}
			<Table {...tableProps} fullWidth />
		</>
	);
}
