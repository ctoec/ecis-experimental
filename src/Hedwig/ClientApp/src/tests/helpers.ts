import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { axe } from 'jest-axe';
import { ValidationError } from '../generated';
import { DeepNonUndefineable } from '../utils/types';

// This is a *very* minimal accessibility check
// From the README for the jest-axe library: "The GDS Accessibility team found that only ~30% of issues are found by automated testing."
export function accessibilityTestHelper(testComponent: React.ReactElement) {
	it('passes accessibility checks', async () => {
		const { container } = render(testComponent);
		const results = await axe(container);
		expect(results).toHaveNoViolations();
		cleanup();
	});
}

type ChangeField = { keys: (string | number)[]; newValue?: any };
export const swapFields = <T>(inputObject: T, changeFields: ChangeField[]): T => {
	// Make a deep copy to avoid changing the original
	const newObject = JSON.parse(JSON.stringify(inputObject));
	changeFields.forEach((field) => {
		let changeObject = newObject;
		field.keys.forEach((key, i) => {
			// Accessors are an ordered array of strings referring to nested keys
			if (i === field.keys.length - 1) {
				// If it's the last key in the array, then it's the thing that needs to be changed to a new value
				changeObject[key] = field.newValue;
			} else {
				// Otherwise keep digging
				changeObject = changeObject[key];
			}
		});
	});
	return newObject;
};

export const getValidationError = (params: {
	field?: string;
	fields?: string[];
	message?: string;
	isSubObjectValidation?: boolean;
}): DeepNonUndefineable<ValidationError> => {
	return {
		field: params.field || null,
		fields: params.fields || null,
		message: params.message ? params.message : 'message',
		isSubObjectValidation: params.isSubObjectValidation ? params.isSubObjectValidation : false,
	};
};
