import { FundingTime } from '../../generated';

export function fundingTimeFromString(str: string) {
	// TODO: should we update this function to also parse "part time / full time"?
	switch (str) {
		case FundingTime.Full:
			return FundingTime.Full;
		case FundingTime.Part:
			return FundingTime.Part;
		default:
			return null;
	}
}

export function prettyFundingTime(time: FundingTime | FundingTime[] | null | undefined): string {
	// Time is either one funding time or an array of unique funding times
	if (Array.isArray(time)) {
		// Should return part time / full time
		return time
			.sort()
			.reverse()
			.map(_time => prettyFundingTime(_time))
			.join(' / ');
	}
	switch (time) {
		case FundingTime.Full:
			return 'full time';
		case FundingTime.Part:
			return 'part time';
		default:
			return '';
	}
}
