import { Age } from '../../generated';

export function ageFromString(str: string) {
	switch (str) {
		case Age.InfantToddler:
			return Age.InfantToddler;
		case Age.Preschool:
			return Age.Preschool;
		case Age.SchoolAge:
			return Age.SchoolAge;
		default:
			return null;
	}
}

export function prettyAge(age: Age | null | undefined) {
	switch (age) {
		case Age.InfantToddler:
			return 'Infant/Toddler';
		case Age.Preschool:
			return 'Preschool';
		case Age.SchoolAge:
			return 'School-age';
		default:
			return '';
	}
}

export function getObjectsByAgeGroup<T extends { ageGroup?: Age }>(inputObjects: T[]) {
	const groupedObjects = {} as { [ageGroup: string]: T[] };
	Object.values(Age).forEach((ageGroup) => {
		groupedObjects[ageGroup] = inputObjects.filter(
			(input) => input.ageGroup && input.ageGroup === ageGroup
		);
	});
	return groupedObjects;
}
