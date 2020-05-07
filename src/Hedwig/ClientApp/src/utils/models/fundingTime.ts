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
	time: FundingTime | null | undefined,
	capitalize: boolean = false
): string {
	let prettyTime = '';
	switch (time) {
		case FundingTime.Full:
			prettyTime = 'full time';
			break;
		case FundingTime.Part:
			prettyTime = 'part time';
			break;
		case FundingTime.Split:
			prettyTime = 'split time';
			break;
		default:
			break;
	}

	if (capitalize) {
		prettyTime = prettyTime.charAt(0).toUpperCase() + prettyTime.slice(1);
	}

	return prettyTime;
}
