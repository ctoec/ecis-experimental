import { FundingTime } from "../generated";

export function fundingTimeFromString(str: string) {
  switch (str) {
    case FundingTime.Full:
      return FundingTime.Full;
    case FundingTime.Part:
      return FundingTime.Part;
    default:
      return null;
  }
};

export function prettyFundingTime(time: FundingTime | null | undefined) {
  switch (time) {
    case FundingTime.Full:
      return 'full time';
    case FundingTime.Part:
      return 'part time';
    default:
      return '';
  }
};
