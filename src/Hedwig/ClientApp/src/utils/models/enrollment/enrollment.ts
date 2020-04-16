import { Enrollment, Gender, User, C4KCertificate } from '../../../generated';
import { isCurrentToRange, getFundingTime } from '..';
import { DateRange } from '../../../components';
import { validatePermissions, getIdForUser } from '..';
import emptyGuid from '../../emptyGuid';
import { DeepNonUndefineable } from '../../types';

export function emptyEnrollment(siteId: number, user?: User) {
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
			c4KCertificates: [] as C4KCertificate[],
		},
	} as DeepNonUndefineable<Enrollment>;
}

export function isFundedForFundingSpace(
	enrollment: Enrollment | null,
	fundingSpaceId: number,
	dateRange?: DateRange
) {
	if (!enrollment) return false;
	if (!enrollment.fundings || !enrollment.fundings.length) return false;

	let fundings = enrollment.fundings
	.filter(funding => funding.fundingSpaceId === fundingSpaceId);

	if(dateRange) {
		fundings = fundings.filter(funding => isCurrentToRange(funding, dateRange))
	}

	return fundings.length > 0;
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
		fundings = fundings.filter(funding => getFundingTime(funding) === _opts.time);
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
