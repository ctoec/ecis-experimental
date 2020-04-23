import { Enrollment, Child, Family } from '../../generated';
import { familyDeterminationNotDisclosed } from './familyDetermination';

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
