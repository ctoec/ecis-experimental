import React from 'react';
import { Organization, Enrollment, FundingSource, Site } from '../generated';
import { isFunded, getCurrentC4kCertificate, getFundingSpaceCapacity } from './models';
import { getC4KTag, getFundingTag } from './fundingType';
import { InlineIcon } from '../components';

export type LegendTextFormatterOpts = {
	organization?: Organization;
	showPastEnrollments?: boolean;
	site?: Site;
};

export type LegendTextFormatter = (
	enrollments: Enrollment[],
	opts?: LegendTextFormatterOpts
) => string | JSX.Element;

type LegendDisplayDetail = {
	symbolGenerator: (_?: any) => React.ReactElement;
	legendTextFormatter: LegendTextFormatter;
	hidden: (organization: Organization, enrollments: Enrollment[]) => boolean;
};

export const legendDisplayDetails: {
	[key: string]: LegendDisplayDetail;
} = {
	CDC: {
		symbolGenerator: (opts?: { [key: string]: any }) =>
			getFundingTag({ fundingSource: FundingSource.CDC, ...opts }),
		legendTextFormatter: (enrollments, opts = {}) => {
			let { organization, site, showPastEnrollments } = opts;
			if (!organization) {
				throw new Error('CDC legend text formatter needs organization');
			}
			const enrolledForCdc = enrollments.filter((enrollment) =>
				isFunded(enrollment, { source: FundingSource.CDC })
			).length;
			const cdcCapacity = getFundingSpaceCapacity(organization, { source: FundingSource.CDC });

			if (showPastEnrollments) {
				return (
					<>
						<span className="text-bold">{enrolledForCdc}</span>
						<span> recieved CDC funding</span>
					</>
				);
			} else if (site) {
				return (
					<>
						<span className="text-bold">{enrolledForCdc}</span>
						<span> CDC spaces filled</span>
					</>
				);
			} else {
				return (
					<>
						<span className="text-bold">
							{enrolledForCdc}/{cdcCapacity}
						</span>
						<span> CDC spaces filled</span>
					</>
				);
			}
		},
		hidden: (organization) =>
			getFundingSpaceCapacity(organization, { source: FundingSource.CDC }) === 0,
	},
	C4K: {
		symbolGenerator: (opts?: { [key: string]: any }) => getC4KTag(opts),
		legendTextFormatter: (enrollments, opts = {}) => {
			const { showPastEnrollments } = opts;
			const enrolledWithC4k = enrollments.filter(
				(enrollment) => !!getCurrentC4kCertificate(enrollment)
			).length;
			return (
				<>
					<span className="text-bold">{enrolledWithC4k}</span>
					<span> {showPastEnrollments ? 'recieved' : 'receiving'} Care 4 Kids</span>
				</>
			);
		},
		// When there are no kids receiving C4K funding, this legend item should be hidden https://github.com/ctoec/ecis-experimental/issues/893
		hidden: (_, enrollments) =>
			enrollments.filter((enrollment) => !!getCurrentC4kCertificate(enrollment)).length === 0,
	},
	missing: {
		symbolGenerator: (opts?: { className?: string }) => (
			<InlineIcon icon="incomplete" className={opts ? opts.className : ''} />
		),
		legendTextFormatter: (enrollments) => {
			// CDC funded enrollments with validationErrors are considered to be missing information
			const missingInformationEnrollmentsCount = enrollments.filter(
				(enrollment) =>
					isFunded(enrollment, {
						source: FundingSource.CDC,
					}) &&
					!!enrollment.validationErrors &&
					enrollment.validationErrors.length > 0
			).length;
			return (
				<>
					<span className="text-bold">{missingInformationEnrollmentsCount}</span>
					<span> missing information</span>
				</>
			);
		},
		// When there are no kids missing information, this legend item should be hidden
		hidden: (_, enrollments) =>
			enrollments.filter(
				(enrollment) =>
					isFunded(enrollment, { source: FundingSource.CDC }) &&
					!!enrollment.validationErrors &&
					enrollment.validationErrors.length > 0
			).length === 0,
	},
};
