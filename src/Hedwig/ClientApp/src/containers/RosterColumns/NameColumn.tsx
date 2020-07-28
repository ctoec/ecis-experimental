import React from 'react';
import { Column, InlineIcon } from '../../components';
import { Enrollment, FundingSource } from '../../generated';
import { Link } from 'react-router-dom';
import { lastFirstNameFormatter } from '../../utils/stringFormatters';
import { isFunded } from '../../utils/models';
import { hasValidationErrors } from '../../utils/validations';

export const NameColumn: (width: number) => Column<Enrollment> = (width) => ({
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
	width: `${width}%`,
});
