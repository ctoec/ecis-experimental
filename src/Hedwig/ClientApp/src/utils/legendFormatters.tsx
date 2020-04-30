import React from 'react';
import { Organization, Enrollment, FundingSource, Site, FundingSpace } from '../generated';
import { DeepNonUndefineable, DeepNonUndefineableArray } from './types';
import { isFunded, getCurrentC4kCertificate, getCombinedCapacity } from './models';
import { getDisplayColorForFundingType, FundingTypes } from './fundingType';
import { Tag, InlineIcon } from '../components';

export type LegendTextFormatterOpts = {
	organization?: Organization;
	showPastEnrollments?: boolean;
	site?: Site;
};

export type LegendTextFormatter = (
	enrollments: DeepNonUndefineable<Enrollment[]>,
	opts?: LegendTextFormatterOpts
) => string | JSX.Element;

type LegendDisplayDetail = {
	symbol?: React.ReactElement;
	legendTextFormatter: LegendTextFormatter;
	hidden: (organization: Organization, enrollments: DeepNonUndefineable<Enrollment[]>) => boolean;
};

export const legendDisplayDetails: {
	[LegendDisplayKey in FundingTypes | string]: LegendDisplayDetail;
} = {
	CDC: {
		symbol: (
			<Tag
				text="CDC"
				color={getDisplayColorForFundingType('CDC')}
				className="position-relative top-neg-2px"
			/>
		),
		legendTextFormatter: (enrollments, opts = {}) => {
			let { organization, site, showPastEnrollments } = opts;
			if (!organization) {
				throw new Error('CDC legend text formatter needs organization');
			}
			const enrolledForCdc = enrollments.filter(enrollment =>
				isFunded(enrollment, { source: FundingSource.CDC })
			).length;
			const cdcCapacity = getCombinedCapacity(
				organization.fundingSpaces as DeepNonUndefineableArray<FundingSpace>,
				FundingSource.CDC
			);
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
		hidden: organization =>
			getCombinedCapacity(
				organization.fundingSpaces as DeepNonUndefineableArray<FundingSpace>,
				FundingSource.CDC
			) === 0,
	},
	C4K: {
		symbol: (
			<Tag
				text="C4K"
				color={getDisplayColorForFundingType('C4K')}
				className="position-relative top-neg-2px"
			/>
		),
		legendTextFormatter: (enrollments, opts = {}) => {
			const { showPastEnrollments } = opts;
			const enrolledWithC4k = enrollments.filter(
				enrollment => !!getCurrentC4kCertificate(enrollment)
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
			enrollments.filter(enrollment => !!getCurrentC4kCertificate(enrollment)).length === 0,
	},
	missing: {
		symbol: <InlineIcon icon="incomplete" />,
		legendTextFormatter: enrollments => {
			// CDC funded enrollments with validationErrors are considered to be missing information
			const missingInformationEnrollmentsCount = enrollments.filter<
				DeepNonUndefineable<Enrollment>
			>(
				enrollment =>
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
			enrollments.filter<DeepNonUndefineable<Enrollment>>(
				enrollment =>
					isFunded(enrollment, { source: FundingSource.CDC }) &&
					!!enrollment.validationErrors &&
					enrollment.validationErrors.length > 0
			).length === 0,
	},
};
