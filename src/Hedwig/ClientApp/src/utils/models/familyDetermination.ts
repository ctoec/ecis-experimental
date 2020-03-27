import idx from 'idx';
import { Enrollment, FamilyDetermination } from '../../generated';
import { dateSorter } from '../dateSorter';

export function familyDeterminationNotDisclosed(enrollment: Enrollment): boolean {
	let determinations = idx(enrollment, _ => _.child.family.determinations) as FamilyDetermination[];

	// If no determinations are present, not disclosed = false
	// (because it is not explicitly true)
	if (!determinations || determinations.length === 0) return false;
	determinations = determinations.sort(determinationSorter);

	return !!determinations[0].notDisclosed;
}

export function determinationSorter(a: FamilyDetermination, b: FamilyDetermination) {
	return dateSorter(a.determinationDate, b.determinationDate);
}
