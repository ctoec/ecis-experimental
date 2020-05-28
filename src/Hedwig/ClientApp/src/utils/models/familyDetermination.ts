import idx from 'idx';
import { Enrollment, FamilyDetermination } from '../../generated';
import { propertyDateSorter } from '../dateSorter';

export function familyDeterminationNotDisclosed(enrollment: Enrollment): boolean {
	let determinations = idx(
		enrollment,
		(_) => _.child.family.determinations
	) as FamilyDetermination[];

	// If no determinations are present, not disclosed = false
	// (because it is not explicitly true)
	if (!determinations || determinations.length === 0) return false;
	determinations = determinations.sort((a, b) =>
		propertyDateSorter(a, b, (f) => f.determinationDate)
	);

	return !!determinations[0].notDisclosed;
}
