export const splitCamelCase = (input: string | undefined, delimiter = ' ') => {
	if (!input || input.length === 0) {
		return '';
	}
	return input.replace(/([a-z](?=[A-Z]))/g, '$1' + delimiter);
};
