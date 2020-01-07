import { Enrollment } from "../../generated";

export function isFunded(enrollment: Enrollment | null,
  opts: {
   source?: string,
   time?: string
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

  return fundings.length > 0;
}