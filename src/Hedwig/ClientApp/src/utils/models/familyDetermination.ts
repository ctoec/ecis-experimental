import idx from 'idx';
import { Enrollment } from '../../generated';

export const familyDeterminationNotDisclosed = (enrollment: Enrollment) : boolean => {
	let determinations = idx(enrollment, _ => _.child.family.determinations)

	// If no determinations are present, not disclosed = false
	// (because it is not explicitly true)
	if (!determinations || determinations.length == 0) return false;
	determinations = determinations.sort((a, b) => {
		if (a.determinationDate > b.determinationDate) return 1;
		if (a.determinationDate < b.determinationDate) return -1;
		return 0;
	});

	return determinations[0].notDisclosed;
};

export function determinationArgsAreValid(args: any) {
  if (args.notDisclosed) {
    args.numberOfPeople = null;
    args.income = null;
    args.determinationDate = null;
    return true;
  }

	if(args.numberOfPeople 
		&& args.income !== undefined && args.income !== null
		&& args.determinationDate) {
    args.notDisclosed = false;
    return true;
  }

  return false;
}