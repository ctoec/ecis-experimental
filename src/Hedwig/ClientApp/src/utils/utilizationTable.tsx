import React from 'react';
import { Region, Age, FundingTime, Enrollment } from '../generated';
import { CdcRates } from '../containers/Reports/ReportDetail/CdcRates';
import { isFundedForFundingSpace } from './models';

export function calculateRate(
	accredited: boolean,
	titleI: boolean,
	region: Region,
	ageGroup: Age,
	time: FundingTime
) {
	const rate = CdcRates.find(
		r =>
			r.accredited === accredited &&
			r.titleI === titleI &&
			r.region === region &&
			r.ageGroup === ageGroup &&
			r.time === time
	);

	return rate ? rate.rate : 0;
}

export function countFundedEnrollments(enrollments: Enrollment[], fundingSpaceId: number) {
	return enrollments.filter(enrollment => {
		if (!enrollment.fundings) return false;
		return isFundedForFundingSpace(enrollment, fundingSpaceId);
	}).length;
}

export function getValueBeforeDecimalPoint(number: number) {
	const numAsString = number.toFixed(2);
	const decimalPointIndex = numAsString.indexOf('.');
	return numAsString.slice(0, decimalPointIndex).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function getNumberOfCommas(str: string) {
	return str.split(',').length - 1;
}

export function getTabularNumPrefix(num: number, maxCommas: number, maxLength: number) {
	// Because of silliness with tables and kerning and whatever else,
	// we need to figure out how many 0s and ,s to prefix a number with so that dollar signs align nicely on the left
	const valueBeforeDecimalPoint = getValueBeforeDecimalPoint(Math.abs(num) || 0);
	const numberOfCommas = getNumberOfCommas(valueBeforeDecimalPoint);
	const numberOfCommasNeeded = maxCommas - numberOfCommas;
	const numberOfLeadingZerosNeeded =
		maxLength - valueBeforeDecimalPoint.length - numberOfCommasNeeded;
	const leadingZeros =
		numberOfLeadingZerosNeeded >= 0 ? '0'.repeat(numberOfLeadingZerosNeeded) : '';
	const commas = numberOfCommasNeeded >= 0 ? ','.repeat(numberOfCommasNeeded) : '';
	return leadingZeros + commas;
}

export function makePrefixerFunc(max: number) {
	// Given the largest absolute number in a column, make a function that will add as many 0s and ,s as needed to align the dollar sign
	const maxBeforeDecimal = getValueBeforeDecimalPoint(max || 0);
	const maxNumberOfCommas = getNumberOfCommas(maxBeforeDecimal);
	const maxLength = `${maxBeforeDecimal}`.length;
	return (num: number) => getTabularNumPrefix(num, maxNumberOfCommas, maxLength);
}

export function ReimbursementRateLine({
	prefix,
	prettyRate,
	weeksInPeriod,
	suffix,
}: {
	prefix: string;
	prettyRate: string;
	weeksInPeriod?: number;
	suffix: string;
}) {
	if (weeksInPeriod === undefined) return <></>;
	return (
		<div>
			<span>$ </span>
			<span style={{ visibility: 'hidden' }}>{prefix}</span>
			{prettyRate}
			<span>
				{' '}
				&times; {weeksInPeriod} weeks
			</span>
			{/* To get the dang thing to line up */}
			<div className="margin-left-05 width-2 display-inline-block">{suffix}</div>
		</div>
	);
}
