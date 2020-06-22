import { Enrollment, ValidationError } from '../../generated';
import { hasValidationErrors } from '.';

const lowercaseFirstLetter = (inputString?: string | null) => {
	if (!inputString) return '';
	return inputString.charAt(0).toLowerCase() + inputString.slice(1);
};

const uppercaseFirstLetter = (inputString?: string | null) => {
	if (!inputString) return '';
	return inputString.charAt(0).toUpperCase() + inputString.slice(1);
};

const getNestedValidationErrors = (object?: any) => {
	if (!object) return [];
	// Return value is array of validation errors
	let levels = 0;
	return (object.validationErrors || [])
		.map((v: ValidationError) => {
			// For each subobject validation error, go into the sub object and get those validation errors
			if (v.isSubObjectValidation) {
				levels += 1;
				const subObject = object[lowercaseFirstLetter(v.field)];
				return getNestedValidationErrors(subObject);
			} else {
				return v;
			}
		})
		.flat(levels);
};

// Get nice string of fields missing info required for CDC report
export const getMissingInfoPrettyString = (enrollment: Enrollment) => {
	const allValidationErrors = getNestedValidationErrors(enrollment);

	// On enrollment.child
	const birthCertFields = ['BirthCertificateId', 'BirthState', 'BirthTown'];
	const birthCertValidationErrors = allValidationErrors.filter((e: ValidationError) =>
		birthCertFields.includes(e.field || '')
	);

	// Income household size, income and date -> Income determination)
	// On family's most recent income det
	console.log(enrollment, allValidationErrors);
	const incomeDetFields = ['Income', 'DeterminationDate', 'NumberOfPeople'];
	const incomeDeterminationValidationErrors = allValidationErrors.filter((e: ValidationError) =>
		incomeDetFields.includes(e.field || '')
	);

	const remainingValidationErrors = allValidationErrors.filter(
		(e: ValidationError) =>
			!incomeDetFields.includes(e.field || '') && !birthCertFields.includes(e.field || '')
	);

	// If enrollment is missing birth certificate or income determination (or re-determination), I see those missing fields named, and then I see a count of how many other fields are missing.
	let missingInfoString = '';

	// If the whole group is missing then we can group (Birth Cert ID, Town and State -> Birth Certificate
	if (birthCertValidationErrors.length > 1) {
		missingInfoString = 'birth certificate';
	} else if (birthCertValidationErrors.length === 1) {
		// TODO: SPLIT ON CAP
		missingInfoString = birthCertValidationErrors[0].field;
	}

	if (incomeDeterminationValidationErrors.length > 1) {
		missingInfoString += ', income determination';
	} else if (incomeDeterminationValidationErrors.length === 1) {
		// TODO: SPLIT ON CAP
		missingInfoString = incomeDeterminationValidationErrors[0].field;
	}

	if (remainingValidationErrors.length) {
		if (
			birthCertValidationErrors.length === 0 &&
			incomeDeterminationValidationErrors.length === 0
		) {
			// If enrollment is not missing birth certificate or income determination, but are missing other fields, I only see the count of how many fields are missing: "5 fields missing".
			missingInfoString = `${remainingValidationErrors.length} fields`;
		}
		// And then all the other fields are totaled and grouped as "and # missing fields")
		missingInfoString += ` and ${remainingValidationErrors.length} other fields`;
	}

	// If only one or 2 are missing, then we can list them out separately
	console.log(enrollment, birthCertValidationErrors, incomeDeterminationValidationErrors);

	if (hasValidationErrors(enrollment)) return uppercaseFirstLetter(missingInfoString);
	return 'No needed information';
};
