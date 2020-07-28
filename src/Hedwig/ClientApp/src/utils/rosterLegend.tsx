import React from 'react';
import { FundingSpace, Enrollment, Site } from '../generated';
import { DateRange } from '../components';
import { isFundedForFundingSpace, prettyFundingSpaceTime } from './models';
import { legendDisplayDetails } from './legendFormatters';

// One legend item per funding space of a given age group
export const generateLegendItems = (
	fundingSpaces: FundingSpace[],
	enrollments: Enrollment[],
	site: Site | null,
	rosterDateRange: DateRange | undefined,
	showPastEnrollments: boolean | undefined,
	forReport: boolean
) =>
	fundingSpaces.map((space) => {
		const enrolledForFundingSpace = enrollments.filter((enrollment) =>
			isFundedForFundingSpace(enrollment, space.id, rosterDateRange)
		).length;
		const prettyFundingTime = prettyFundingSpaceTime(space);
		return {
			symbol: legendDisplayDetails[space.source || ''].symbolGenerator({
				fundingTime: space.time,
				forReport,
			}),
			hidden: site && enrolledForFundingSpace === 0,
			// If we're looking at an org roster, show the funding spaces available even if they're not used
			// Hide the legend item if there are no kids enrolled for this funding space type and we are looking at one site
			text: (
				<>
					<span>
						{prettyFundingTime}
						{' — '}
					</span>
					<span className="text-bold">
						{/* If past enrollments or site, only show number of spaces filled, not ratio for entire organization */}
						{showPastEnrollments || site
							? enrolledForFundingSpace
							: `${enrolledForFundingSpace}/${space.capacity}`}
					</span>
					<span> spaces filled</span>
				</>
			),
		};
	});
