import React from 'react';
import { Column } from '@ctoec/component-library';
import { Enrollment } from '../../generated';
import dateFormatter from '../../utils/dateFormatter';
import moment from 'moment';

export const EnrollmentDateColumn: (width: number) => Column<Enrollment> = (width) => ({
	name: 'Enrollment date',
	cell: ({ row }) => (
		<td className="oec-table__cell--tabular-nums">
			{row.entry
				? dateFormatter(row.entry) +
				  (row.exit && moment(row.exit).isBefore(moment()) ? `–${dateFormatter(row.exit)}` : '')
				: ''}
		</td>
	),
	sort: (row) => (row.entry && row.entry.toString()) || '',
	width: `${width}%`,
});
