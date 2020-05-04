import { Enrollment, FundingSource, FundingTime, Funding } from '../../../generated';
import { isFunded } from '.';

const baseEnrollment: Enrollment = {
	id: 1,
	siteId: 1,
	childId: 'foo-bar',
};

const baseFunding: Funding = {
	id: 1,
	enrollmentId: 1,
	fundingSpaceId: 1,
};

describe('enrollment utils', () => {
	it.each([undefined, []])('isFunded returns false if no fundings', fundings => {
		const enrollment: Enrollment = {
			...baseEnrollment,
			fundings: fundings,
		};

		const res = isFunded(enrollment);

		expect(res).toBeFalsy();
	});

	it.each([
		[FundingSource.CDC, true],
		[undefined, false],
	])(
		'isFunded for source returns false if funding does not match source',
		(fundingSource, isFundedRes) => {
			const funding = {
				...baseFunding,
				source: fundingSource as FundingSource,
			};

			const enrollment: Enrollment = {
				...baseEnrollment,
				fundings: [funding],
			};

			const res = isFunded(enrollment, { source: FundingSource.CDC });

			expect(res).toBe(isFundedRes);
		}
	);
});
