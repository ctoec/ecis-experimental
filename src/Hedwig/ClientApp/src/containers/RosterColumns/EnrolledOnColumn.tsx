import React from 'react';
import { Column } from '@ctoec/component-library';
import { Enrollment } from '../../generated';
import dateFormatter from '../../utils/dateFormatter';

export const EnrolledOnColumn: (width: number) => Column<Enrollment> = (width) => ({
	name: 'Enrolled on',
	cell: ({ row }) => (
		<td className="oec-table__cell--tabular-nums">{row.entry ? dateFormatter(row.entry) : ''}</td>
	),
	sort: (row) => (row.entry && row.entry.toString()) || '',
	width: `${width}%`,
});
