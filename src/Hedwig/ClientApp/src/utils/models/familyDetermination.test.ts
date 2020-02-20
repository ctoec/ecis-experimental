import { Enrollment, Child, Family } from '../../generated';
import { familyDeterminationNotDisclosed, determinationSorter } from './familyDetermination';

const baseEnrollment: Enrollment = {
	id: 1,
	siteId: 1,
	childId: 'foo-bar',
};

const baseChild: Child = {
	id: 'foo-bar',
	firstName: 'first',
	lastName: 'last',
	organizationId: 1,
};

const baseFamily: Family = {
	id: 1,
	organizationId: 1,
};

it.each([
	[true, true],
	[false, false],
	[undefined, false],
])(
	'familyDeterminationNotDisclosed correctly assesses if family determination is not disclosed',
	(notDisclosed, notDisclosedRes) => {
		const determination = {
			id: 1,
			familyId: 1,
			determinationDate: new Date('2019-01-01'),
			notDisclosed: notDisclosed,
		};

		const enrollment = {
			...baseEnrollment,
			child: {
				...baseChild,
				family: {
					...baseFamily,
					determinations: [determination],
				},
			},
		};

		const res = familyDeterminationNotDisclosed(enrollment);

		expect(res).toBe(notDisclosedRes);
	}
);

it.each([undefined, []])(
	'familyDeterminationNotDisclosed returns false if no determinations',
	determinations => {
		const enrollment = {
			...baseEnrollment,
			child: {
				...baseChild,
				family: {
					...baseFamily,
					determinations: determinations,
				},
			},
		};

		const res = familyDeterminationNotDisclosed(enrollment);

		expect(res).toBeFalsy();
	}
);

it('determinationSorter sorts determinations by determinationDate', () => {
	const noDateId = 0;
	const noDate = {
		id: noDateId,
		familyId: 1,
		determinationDate: undefined,
	};

	const earlierId = 1;
	const earlier = {
		id: earlierId,
		familyId: 1,
		determinationDate: new Date('2019-01-01'),
	};

	const laterId = 2;
	const later = {
		id: laterId,
		familyId: 1,
		determinationDate: new Date('2019-10-01'),
	};

	const determinations = [noDate, later, earlier];

	determinations.sort(determinationSorter);

	expect(determinations.map(det => det.id)).toStrictEqual([earlierId, laterId, noDateId]);
});
