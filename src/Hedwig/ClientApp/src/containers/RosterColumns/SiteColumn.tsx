import React from 'react';
import { Column } from '@ctoec/component-library';
import { Enrollment } from '../../generated';

export const SiteColumn: (width: number) => Column<Enrollment> = (width) => ({
	name: 'Site',
	cell: ({ row }) => (
		<td
			className="ellipsis-wrap-text ellipsis-wrap-text--tight"
			title={(row.site && row.site.name) || undefined}
		>
			{row.site && row.site.name}
		</td>
	),
	sort: (row) => ((row.site && row.site.name) || '').toLowerCase(),
	width: `${width}%`,
});
