import React from 'react';
import { Column } from '@ctoec/component-library';
import { Enrollment } from '../../generated';
import dateFormatter from '../../utils/dateFormatter';

export const BirthdateColumn: (width: number) => Column<Enrollment> = (width) => ({
	name: 'Birthdate',
	cell: ({ row }) =>
		(row.child && (
			<td className="oec-table__cell--tabular-nums">
				{row.child.birthdate && dateFormatter(row.child.birthdate)}
			</td>
		)) || <></>,
	sort: (row) => ((row.child && row.child.birthdate) || new Date(0)).getTime(),
	width: `${width}%`,
});
