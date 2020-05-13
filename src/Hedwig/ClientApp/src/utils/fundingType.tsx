import { Funding, FundingSpace, FundingTime } from '../generated';
import { Tag } from '../components';
import {
	getFundingTime,
} from './models';

function ptOrFT(fundingSpace?: FundingSpace) {
	if (!fundingSpace) return '';

	if (fundingSpace.time === FundingTime.Split) {
		return '-PT/FT';
	}
	if (fundingSpace.time === FundingTime.Full) {
		return '–FT';
	}
	if (fundingSpace.time === FundingTime.Part) {
		return '–PT';
	}
	return '';
}

export function getFundingTag(
	options?: {
		funding?: Funding,
		index?: any;
		className?: string;
		includeTime?: boolean;
	}) {
	const { index, className, includeTime, funding } = options || {};
	let key, text;
	if (funding && !funding.source) {
		text = 'Not specified'
		key = 'not-specified'
	} else if (funding && funding.source && includeTime) {
		// Default to CDC
		key = `CDC-${getFundingTime(funding)}`;
		text = `CDC${ptOrFT(funding.fundingSpace)}`;
	} else {
		text = 'CDC';
	}
	if (index) key = `${key}-${index}`;
	return Tag({
		key, text, color: 'blue-50v', className
	});
}

export function getC4KTag(options?: { className?: string, index?: string | number }) {
	const { index, className } = options || {}
	let key = 'C4K';
	if (index) key = `${key}-${index}`;
	return Tag({ key, text: 'C4K', color: 'violet-warm-60', className });
}
