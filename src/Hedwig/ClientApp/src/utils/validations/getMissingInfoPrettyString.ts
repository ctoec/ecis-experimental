import { Enrollment, ValidationError } from '../../generated';
import { splitCamelCase } from '../stringFormatters';

const lowercaseFirstLetter = (inputString?: string | null) => {
	if (!inputString) return '';
	return inputString.charAt(0).toLowerCase() + inputString.slice(1);
};

const uppercaseFirstLetter = (inputString?: string | null) => {
	if (!inputString) return '';
	return inputString.charAt(0).toUpperCase() + inputString.slice(1);
};

const replaceId = (inputString: string) => {
	return inputString.replace(/\s[i|I][d|D]/, ' ID');
};

const getNestedValidationErrors = (object?: any) => {
	if (!object) return [];
	// Return value is array of validation errors
	let levels = 1;
	return (object.validationErrors || [])
		.map((v: ValidationError) => {
			// For each subobject validation error, go into the sub object and get those validation errors
			if (v.isSubObjectValidation) {
				levels += 1;
				const subObject = object[lowercaseFirstLetter(v.field)];
				if (Array.isArray(subObject)) {
					return subObject.map(_v => getNestedValidationErrors(_v))
				}
				return getNestedValidationErrors(subObject);
			} else {
				return v;
			}
		})
		.flat(levels);
};

export const getMissingInfoPrettyString = (enrollment: Enrollment) => {
	// If enrollment is missing birth certificate or income determination (or re-determination),
	// I see those missing fields named, and then I see a count of how many other fields are missing.
	const allValidationErrors = getNestedValidationErrors(enrollment);

	const birthCertFields = ['BirthCertificateId', 'BirthState', 'BirthTown'];
	const birthCertValidationErrors = allValidationErrors.filter((e: ValidationError) =>
		birthCertFields.includes(e.field || '')
	);

	const incomeDetFields = ['Income', 'DeterminationDate', 'NumberOfPeople'];
	const incomeDeterminationValidationErrors = allValidationErrors.filter((e: ValidationError) =>
		incomeDetFields.includes(e.field || '')
	);

	const remainingValidationErrors = allValidationErrors.filter(
		(e: ValidationError) =>
			!incomeDetFields.includes(e.field || '') && !birthCertFields.includes(e.field || '')
	);

	const missingInfoFields = [];

	if (birthCertValidationErrors.length > 1) {
		// If the whole group is missing then we can group (Birth Cert ID, Town and State -> Birth Certificate)
		missingInfoFields.push('birth certificate')
	} else if (birthCertValidationErrors.length === 1) {
		missingInfoFields.push(splitCamelCase(birthCertValidationErrors[0].field))
	}

	if (
		incomeDeterminationValidationErrors.length > 1 ||
		!enrollment.child ||
		!enrollment.child.family
	) {
		// Income household size, income and date -> income determination)
		missingInfoFields.push('income determination')
	} else if (incomeDeterminationValidationErrors.length === 1) {
		missingInfoFields.push(splitCamelCase(incomeDeterminationValidationErrors[0].field))
	}

	if (remainingValidationErrors.length) {
		if (
			birthCertValidationErrors.length === 0 &&
			incomeDeterminationValidationErrors.length === 0
		) {
			// If enrollment is not missing birth certificate or income determination, but is missing other fields
			return `${remainingValidationErrors.length} fields`;
		}
		// All the other fields are totaled and grouped
		missingInfoFields.push(`${remainingValidationErrors.length} other fields`)
	}

	let missingInfoString = 'No needed information';
	if (missingInfoFields.length === 1) {
		missingInfoString = missingInfoFields[0]
	} else if (missingInfoFields.length === 2) {
		missingInfoString = missingInfoFields.join(' and ')
	} else if (missingInfoFields.length > 2) {
		missingInfoString = `${missingInfoFields.slice(0, -1).join(', ')}, and ${missingInfoFields[missingInfoFields.length - 1]}`
	}

	return replaceId(uppercaseFirstLetter(missingInfoString.toLowerCase()));
};
