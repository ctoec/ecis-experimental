type ChangeField = { keys: string[]; newValue?: any };
export const swapFields = <T>(inputObject: T, changeFields: ChangeField[]): T => {
	// Make a deep copy to avoid changing the original
	const newObject = JSON.parse(JSON.stringify(inputObject));
	changeFields.forEach(field => {
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
