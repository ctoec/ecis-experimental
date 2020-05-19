import { FundingTime } from '../../generated';

export function prettyFundingTime(
	time: FundingTime | null | undefined,
	opts?: { capitalize?: boolean, splitTimeText?: string }
): string {
	const { capitalize, splitTimeText } = { capitalize: false, splitTimeText: 'split time', ...opts }
	let prettyTime = '';
	switch (time) {
		case FundingTime.Full:
			prettyTime = 'full time';
			break;
		case FundingTime.Part:
			prettyTime = 'part time';
			break;
		case FundingTime.Split:
			prettyTime = splitTimeText;
			break;
		default:
			break;
	}

	if (capitalize) {
		prettyTime = prettyTime.charAt(0).toUpperCase() + prettyTime.slice(1);
	}

	return prettyTime;
}
