import { Enrollment } from "../../generated";
import { isCurrentToRange, DateDateRange } from "./funding";

export function isFunded(
  enrollment: Enrollment | null,
  opts: {
   source?: string,
   time?: string,
   currentRange?: DateDateRange
  }
)
{
  if (!enrollment) return false;

  if(!enrollment.fundings || !enrollment.fundings.length) return false;

  let fundings = enrollment.fundings;

  if(opts.source) {
    fundings = fundings.filter(funding => funding.source === opts.source);
  }

  if(opts.time) {
    fundings = fundings.filter(funding => funding.time === opts.time);
  }

  if(opts.currentRange) {
    fundings = fundings.filter(funding => isCurrentToRange(funding, opts.currentRange));
  }

  return fundings.length > 0;
}

export const enrollmentExitReasons = {
	AgedOut: "Aged out",
	StoppedAttending: "Stopped attending",
	DifferentProgram: "Chose to attend a different program",
	MovedInCT: "Moved within Connecticut",
	MovedOutCT: "Moved to another state",
	LackOfPayment: "Withdrew due to lack of payment",
	AskedToLeave: "Child was asked to leave",
	Unknown: "Unknown",
};