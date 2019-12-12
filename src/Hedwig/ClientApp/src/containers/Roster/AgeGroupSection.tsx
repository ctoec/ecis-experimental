import React from 'react';
import idx from 'idx';
import pluralize from 'pluralize';
import { Link } from 'react-router-dom';
import { Table, TableProps } from '../../components/Table/Table';
import Tag from '../../components/Tag/Tag';
import InlineIcon from '../../components/InlineIcon/InlineIcon';
import { Enrollment, FundingSpace } from '../../generated';
import nameFormatter from '../../utils/nameFormatter';
import dateFormatter from '../../utils/dateFormatter';
import getColorForFundingSource, { fundingSourceDetails } from '../../utils/getColorForFundingType';
import missingInformation from '../../utils/missingInformation';

export type SpecificTableProps = { id: string; data: Enrollment[] };

type AgeGroupSectionProps = {
	ageGroupTitle: string;
	tableProps: SpecificTableProps;
	fundingCapacities?: { [key: string]: FundingSpace[] };
};

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

export default function AgeGroupSection({
	ageGroupTitle,
	tableProps,
	fundingCapacities,
}: AgeGroupSectionProps) {
	if (!tableProps.data.length) return <></>;
	const groupTableProps = Object.assign({}, defaultRosterTableProps, tableProps)
	return (
		<>
			<h2>{`${ageGroupTitle} (${pluralize('child', tableProps.data.length, true)})`}</h2>
			{fundingCapacities && (
				<ul>
					{Object.keys(fundingCapacities).map(capacityTime => (
						<li key={`${capacityTime}-${ageGroupTitle}`}>
							<span className="text-bold">
								{`${tableProps.data.length}/${
									fundingCapacities[capacityTime][0].capacity
								} ${capacityTime.toLowerCase()} time`}
							</span>
							<span>{` ${ageGroupTitle.toLowerCase()} spaces filled`}</span>
						</li>
					))}
				</ul>
			)}
			<Table {...groupTableProps} fullWidth />
		</>
	);
}
