import { FundingTime } from '../generated/';
import { fundingTimeFromString } from './models/fundingTime';

export enum FundingType {
	CDC,
	PRIVATE_PAY,
	UNSELECTED,
}

export type FundingSelection = {
	source: FundingType;
	time?: FundingTime;
};

export function fundingSelectionToString(fundingSelection: FundingSelection): string {
	switch (fundingSelection.source) {
		case FundingType.UNSELECTED:
			return '';
		case FundingType.PRIVATE_PAY:
			return 'privatePay';
		case FundingType.CDC:
			return '' + fundingSelection.time;
	}
}

export function fundingSelectionFromString(value: string): FundingSelection {
	// prettier-ignore
	const source =
		(value === 'privatePay' ?
			FundingType.PRIVATE_PAY : (value === '' ? FundingType.UNSELECTED : FundingType.CDC));
	if (source !== FundingType.CDC) {
		return { source };
	}
	const time = fundingTimeFromString(value) || undefined;
	return { source, time };
}
