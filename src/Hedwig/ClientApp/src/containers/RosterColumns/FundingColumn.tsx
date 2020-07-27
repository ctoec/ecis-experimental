import React from 'react';
import { Column } from '@ctoec/component-library';
import { Enrollment } from '../../generated';
import {
	dedupeFundings,
	isCurrentToRange,
	isCurrentToRangeC4K,
	NO_FUNDING,
} from '../../utils/models';
import { getC4KTag, FundingTagOptionsType } from '../../utils/fundingType';
import idx from 'idx';
import { DateRange } from '../../components';

/**
 * A function for generaring funding columns. Parameterized on
 * function that generates the specific funding tag and the width
 * of the column.
 * @param getFundingTag Function for generating a funding tag
 */
export const FundingColumn: (
	getFundingTag: (options: FundingTagOptionsType) => JSX.Element
) => (rosterDateRange: DateRange | undefined, width: number) => Column<Enrollment> = (
	getFundingTag
) => (rosterDateRange, width) => ({
	name: 'Funding',
	cell: ({ row }) => {
		const filteredFundings = dedupeFundings(
			(row.fundings || []).filter((f) => isCurrentToRange(f, rosterDateRange))
		);
		const filteredCertificates = ((row.child && row.child.c4KCertificates) || []).filter((c) =>
			isCurrentToRangeC4K(c, rosterDateRange)
		);

		return (
			<td>
				{filteredFundings.map((funding, index) =>
					getFundingTag({
						fundingSource: funding.source,
						index,
						fundingTime: funding.fundingSpace ? funding.fundingSpace.time : undefined,
					})
				)}
				{filteredCertificates.length > 0 && getC4KTag()}
				{filteredFundings.length === 0 && filteredCertificates.length === 0 && (
					<span className="text-italic text-base">{NO_FUNDING}</span>
				)}
			</td>
		);
	},
	sort: (row) => idx(row, (_) => _.fundings[0].source) || '',
	width: `${width}%`,
});
