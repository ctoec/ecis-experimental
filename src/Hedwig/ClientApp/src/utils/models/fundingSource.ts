import { FundingSource } from '../../generated';

export function fundingSourceFromString(str: string) {
	switch (str) {
		case FundingSource.CDC:
			return FundingSource.CDC;
		default:
			// Private pay
			return null;
	}
}

export function prettyFundingSource(source: FundingSource | null | undefined) {
	switch (source) {
		case FundingSource.CDC:
			return 'Child day care';
		default:
			return 'Private pay';
	}
}
