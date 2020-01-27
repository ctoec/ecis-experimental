import idx from 'idx';
import { Enrollment, FamilyDetermination } from '../../generated';

export function familyDeterminationNotDisclosed(enrollment: Enrollment): boolean {
	let determinations = idx(enrollment, _ => _.child.family.determinations) as FamilyDetermination[];

	// If no determinations are present, not disclosed = false
	// (because it is not explicitly true)
	if (!determinations || determinations.length === 0) return false;
	determinations = determinations.sort(determinationSorter);

	return !!determinations[0].notDisclosed;
}

export function determinationSorter(a: FamilyDetermination, b: FamilyDetermination) {
	if(!a.determinationDate) return 1;
	if(!b.determinationDate) return -1;
	if(a.determinationDate > b.determinationDate) return 1;
	if(a.determinationDate < b.determinationDate) return -1;
	return 0;
}	