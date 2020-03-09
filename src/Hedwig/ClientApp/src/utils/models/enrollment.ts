import { Enrollment, Gender } from '../../generated';
import { isCurrentToRange } from './funding';
import { DateRange } from '../../components';
import { validatePermissions, getIdForUser } from '.';
import { user } from '../../tests/data';
import emptyGuid from '../emptyGuid';
import { DeepNonUndefineable } from '../types';

export function emptyEnrollment(siteId: number) {
	return {
		id: 0,
		siteId: validatePermissions(user, 'site', siteId) ? siteId : 0,
		childId: emptyGuid(),
		child: {
			id: emptyGuid(),
			organizationId: getIdForUser(user, 'org'),
			sasid: null,
			firstName: null,
			middleName: null,
			lastName: null,
			suffix: null,
			birthCertificateId: null,
			birthTown: null,
			birthState: null,
			birthdate: null,
			americanIndianOrAlaskaNative: false,
			asian: false,
			blackOrAfricanAmerican: false,
			nativeHawaiianOrPacificIslander: false,
			white: false,
			gender: Gender.Unspecified,
		},
	} as DeepNonUndefineable<Enrollment>;
}

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
