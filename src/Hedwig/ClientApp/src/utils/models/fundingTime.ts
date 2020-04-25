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

export function prettyFundingTime(
	time: FundingTime | FundingTime[] | null | undefined,
	capitalize: boolean = false
): string {
	// Time is either one funding time or an array of unique funding times
	let prettyTime = '';
	if (Array.isArray(time)) {
		// Should return part time / full time
		prettyTime = time
			.sort()
			.reverse()
			.map(_time => prettyFundingTime(_time))
			.join(' / ');
	}
	switch (time) {
		case FundingTime.Full:
			prettyTime = 'full time';
			break;
		case FundingTime.Part:
			prettyTime = 'part time';
			break;
		default:
			break;
	}

	if (capitalize) {
		prettyTime = prettyTime.charAt(0).toUpperCase() + prettyTime.slice(1);
	}

	return prettyTime;
}
