export const splitCamelCase = (input: string, delimiter = ' ') => {
	return input.replace(/([a-z](?=[A-Z]))/g, '$1' + delimiter);
};
