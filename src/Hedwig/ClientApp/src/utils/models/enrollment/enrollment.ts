import { Enrollment, Gender, User, C4KCertificate, FundingSource } from '../../../generated';
import { isCurrentToRange } from '..';
import { DateRange } from '../../../components';
import { validatePermissions, getIdForUser } from '..';
import emptyGuid from '../../emptyGuid';
import produce from 'immer';
import set from 'lodash/set';

export function enrollmentWithDefaultFamily(enrollment: Enrollment) {
	return produce<Enrollment>(enrollment, (draft) => set(draft, 'child.family', {}));
}

export function createEmptyEnrollment(siteId: number, user: User | null): Enrollment {
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
	};
}

/**
 * Filters a set of enrollments based on their fundings. Checks if an
 * enrollment has a funding for the given fundingspace, and optionally
 * checks if that funding is current to a given date range.
 *
 * To be used when enrollments must be filtered by funding source and funding time
 * @param enrollment
 * @param fundingSpaceId
 * @param dateRange
 */
export function isFundedForFundingSpace(
	enrollment: Enrollment | null,
	fundingSpaceId: number,
	dateRange?: DateRange
) {
	if (!enrollment) return false;
	if (!enrollment.fundings || !enrollment.fundings.length) return false;

	let fundings = enrollment.fundings.filter((funding) => funding.fundingSpaceId === fundingSpaceId);

	if (dateRange) {
		fundings = fundings.filter((funding) => isCurrentToRange(funding, dateRange));
	}

	return fundings.length > 0;
}

/**
 * Filters a set of enrollments case on their fundings. Checks if an
 * enrollment has a funding for the given funding source.
 *
 * To be used when enrollments only need to be filtered by funding source, not time.
 * @param enrollment
 * @param opts
 */
export function isFunded(
	enrollment: Enrollment | null,
	opts?: {
		source?: FundingSource;
	}
) {
	if (!enrollment) return false;

	if (!enrollment.fundings || !enrollment.fundings.length) return false;

	let fundings = enrollment.fundings;
	const { source } = opts || {};

	if (source) {
		fundings = fundings.filter((funding) => funding.source === source);
	}

	return fundings.length > 0;
}
