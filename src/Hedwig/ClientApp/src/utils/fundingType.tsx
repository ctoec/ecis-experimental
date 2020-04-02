import { FundingTime, C4KCertificate, Funding, FundingSpace } from '../generated';
import { Tag, DateRange } from '../components';
import { isCurrentFundingToRange, dedupeFundings, isCurrentToRangeC4K, getTime } from './models';
import { DeepNonUndefineable } from './types';

export type FundingTypes = 'CDC' | 'C4K';

interface FundingTypeDiscriminator {
	type: FundingTypes;
}

type InternalFunding = DeepNonUndefineable<Funding> & { type: 'CDC' };
type InternalC4KCertificate = DeepNonUndefineable<C4KCertificate> & { type: 'C4K' };

export type FundingType = (InternalFunding | InternalC4KCertificate) & FundingTypeDiscriminator;

function ptOrFT(fundingSpace?: FundingSpace) {
	if(!fundingSpace) return '';

	if (fundingSpace.time === 'Full') {
		return '–FT';
	}
	if (fundingSpace.time === 'Part') {
		return '–PT';
	}
	return '';
}

export function generateFundingTypeTag(
	fundingType: FundingType,
	options?: {
		index?: any;
		className?: string;
		includeTime?: boolean;
	}
): JSX.Element {
	const color = fundingType.type ? getDisplayColorForFundingType(fundingType.type) : 'gray-90';
	const { index, className, includeTime } = options || {};
	let key, text;
	switch (fundingType.type) {
		case 'CDC':
			key = `${fundingType.source}-${getTime(fundingType)}`;
			if (index) key = `${key}-${index}`;
			if (fundingType.source && includeTime) {
				text = `CDC${ptOrFT(fundingType.fundingSpace)}`;
			} else if (fundingType.source) {
				text = 'CDC';
			} else {
				text = 'Not specified';
			}
			return Tag({ key, text, color, className });
		case 'C4K':
			key = 'C4K';
			if (index) key = `${key}-${index}`;
			text = 'C4K';
			return Tag({ key, text, color, className });
	}
}

export function getDisplayColorForFundingType(type: FundingTypes) {
	const colorMap = {
		CDC: 'blue-50v',
		C4K: 'violet-warm-60',
	};
	return colorMap[type];
}

/**
 * Filter fundings for displaying
 * @param fundings
 * @param rosterDateRange
 */
export function filterFundingTypesForRosterTags(
	fundingTypes: FundingType[] | null,
	rosterDateRange?: DateRange
): FundingType[] {
	if (!fundingTypes) {
		return [];
	}

	const fundings = fundingTypes
		.filter(fundingType => fundingType.type === 'CDC')
		.filter(fundingType => isCurrentFundingToRange(fundingType as Funding, rosterDateRange));
	const certificates = fundingTypes
		.filter(fundingType => fundingType.type === 'C4K')
		.filter(fundingType => isCurrentToRangeC4K(fundingType as C4KCertificate, rosterDateRange));

	return [...(dedupeFundings(fundings as Funding[]) as FundingType[]), ...certificates];
}
