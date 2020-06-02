import { C4KCertificate, Enrollment } from '../../generated';
import { DateRange } from '../../components';
import moment from 'moment';
import { dateSorter } from '../dateSorter';

/**
 * C4K funding does NOT overlap with range if:
 * - Certificate end date is before range start
 * - Certificate start date is after range ends
 * @param funding
 * @param range
 */
export function isCurrentToRangeC4K(cert: C4KCertificate, range?: DateRange): boolean {
	range = range ? range : { startDate: moment(), endDate: moment() };
	if (
		(range.startDate && cert.endDate && range.startDate.isAfter(cert.endDate)) ||
		(range.endDate && cert.startDate && range.endDate.isBefore(cert.startDate))
	) {
		return false;
	}
	return true;
}

export function c4kCertificateSorter(a: C4KCertificate, b: C4KCertificate) {
	return dateSorter(a.startDate, b.startDate);
}

/**
 * Returns the c4k cert with no end date
 * (Multiple certs with no end date is an invalid data state)
 * @param enrollment
 */
export function getCurrentC4kCertificate(
	enrollment: Enrollment | null
): C4KCertificate | undefined {
	if (!enrollment) return undefined;
	if (!enrollment.child) return undefined;

	return (enrollment.child.c4KCertificates || []).find((cert) => !cert.endDate);
}

export function activeC4kFundingAsOf(enrollment: Enrollment | null, asOf?: Date) {
	if (!asOf) {
		return getCurrentC4kCertificate(enrollment);
	} else {
		if (!enrollment || !enrollment.child) {
			return undefined;
		}
		const c4kCerts = enrollment.child.c4KCertificates;
		// Sorts by the start of the certificate
		const sortedCerts = (c4kCerts || []).sort(c4kCertificateSorter);
		// find cert with asOf between start and end dates
		return sortedCerts.find((cert) => {
			const startDateIsBeforeAsOf = !cert.startDate || moment(cert.startDate).isBefore(asOf);
			const endDateIsEmptyOrAfterAsOf = !cert.endDate || moment(cert.endDate).isAfter(asOf);
			return startDateIsBeforeAsOf && endDateIsEmptyOrAfterAsOf;
		});
	}
}
