import moment from 'moment';
import { isCurrentToRangeC4K } from '.';
import { C4KCertificate } from '../../generated';

describe('c4kCertificate utils', () => {
	it.each([
		// cert end date is before range start
		['2019-10-01', '2019-10-30', '2020-01-01', '2020-01-15', false],
		// cert start date period is after range end
		['2020-02-01', '2020-02-28', '2020-01-01', '2020-01-15', false],
		// cert start date is before range end and
		// and cert end date is after range start
		['2019-10-01', '2020-01-10', '2020-01-01', '2020-01-15', true],
		// works for a range of one date that lies within the funding dates
		['2019-10-01', '2020-01-15', '2020-01-01', '2020-01-01', true],
	])(
		'determines if C4K funding (%s - %s) is current to given range (%s - %s)',
		(certStart, certEnd, rangeStart, rangeEnd, isCurrent) => {
			const baseFunding = { id: 1, childId: '1', familyCertificateId: 1, type: 'C4K' as 'C4K' };

			const funding = {
				...baseFunding,
				startDate: new Date(certStart as string),
				endDate: new Date(certEnd as string),
			} as C4KCertificate;

			const range = {
				startDate: moment(rangeStart as string),
				endDate: moment(rangeEnd as string),
			};

			const res = isCurrentToRangeC4K(funding, range);
			expect(res).toBe(isCurrent);
		}
	);
});
