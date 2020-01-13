import { Enrollment } from "../../generated";
import { isCurrent } from "./funding";

export function isFunded(
  enrollment: Enrollment | null,
  opts: {
   source?: string,
   time?: string,
   current?: boolean
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

  if(opts.current) {
    fundings = fundings.filter(funding => isCurrent(funding));
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