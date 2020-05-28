import React from 'react';
import { FundingTime, FundingSource } from '../generated';
import { Tag } from '../components';

function ptOrFT(fundingTime?: FundingTime) {
	if (fundingTime === FundingTime.Split) {
		return '-PT/FT';
	}
	if (fundingTime === FundingTime.Full) {
		return '–FT';
	}
	if (fundingTime === FundingTime.Part) {
		return '–PT';
	}
	return '';
}

export function getFundingTag(options?: {
	fundingSource?: FundingSource;
	fundingTime?: FundingTime;
	index?: any;
	className?: string;
}) {
	const { index, className, fundingSource, fundingTime } = options || {};
	if (!fundingSource) {
		return <></>;
	}
	let key = 'CDC';
	let text = 'CDC';
	if (fundingTime) {
		// Default to CDC
		const prettyTime = ptOrFT(fundingTime);
		key = `CDC-${prettyTime}`;
		text = `CDC${prettyTime}`;
	}
	if (index) key = `${key}-${index}`;
	return Tag({
		key,
		text,
		color: 'blue-50v',
		className,
	});
}

export function getC4KTag(options?: { className?: string; index?: string | number }) {
	const { index, className } = options || {};
	let key = 'C4K';
	if (index) key = `${key}-${index}`;
	return Tag({ key, text: 'C4K', color: 'violet-warm-60', className });
}
