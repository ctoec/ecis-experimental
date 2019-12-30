import { FundingTime } from "../generated";

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
