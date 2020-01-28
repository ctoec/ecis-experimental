import { FundingTime } from '../generated/';
import { fundingTimeFromString } from './fundingTimeUtils';

export enum FundingSelection {
	CDC_FULL,
	CDC_PART,
	PRIVATE_PAY,
	UNSELECTED
}

export function fundingSelectionToString(fundingSelection: FundingSelection) {
	switch (fundingSelection) {
		case FundingSelection.UNSELECTED:
			return '';
		case FundingSelection.PRIVATE_PAY:
			return 'privatePay';
		case FundingSelection.CDC_FULL:
			return '' + FundingTime.Full;
		case FundingSelection.CDC_PART:
			return '' + FundingTime.Part;
	}
}

export function fundingSelectionFromString(value: string): FundingSelection {
	return value === 'privatePay' ?
		FundingSelection.PRIVATE_PAY :
		value === '' ?
			FundingSelection.UNSELECTED :
			fundingTimeFromString(value) === FundingTime.Full ?
				FundingSelection.CDC_FULL :
				FundingSelection.CDC_PART;
}