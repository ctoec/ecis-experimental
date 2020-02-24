import { Enrollment } from '../../generated';
import { isCurrentToRange } from './funding';
import { DateRange } from '../../components';

export function isFunded(
	enrollment: Enrollment | null,
	opts?: {
		source?: string;
		time?: string;
		currentRange?: DateRange;
	}
) {
	if (!enrollment) return false;

	if (!enrollment.fundings || !enrollment.fundings.length) return false;

	let fundings = enrollment.fundings;

	const _opts = opts || {};
	if (_opts.source) {
		fundings = fundings.filter(funding => funding.source === _opts.source);
	}

	if (_opts.time) {
		fundings = fundings.filter(funding => funding.time === _opts.time);
	}

	if (_opts.currentRange) {
		fundings = fundings.filter(funding => isCurrentToRange(funding, _opts.currentRange));
	}

	return fundings.length > 0;
}

export const enrollmentExitReasons = {
	AgedOut: 'Aged out',
	StoppedAttending: 'Stopped attending',
	DifferentProgram: 'Chose to attend a different program',
	MovedInCT: 'Moved within Connecticut',
	MovedOutCT: 'Moved to another state',
	LackOfPayment: 'Withdrew due to lack of payment',
	AskedToLeave: 'Child was asked to leave',
	Unknown: 'Unknown',
};
