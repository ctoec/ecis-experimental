import moment, { Moment } from "moment";

export const parseStringDateInput = (input?: string): Moment | null => {
	// Moment *sort of* does this but here we're ensuring that we don't accept garbage and don't cause time zone problems
	let parsedInput = null;
	if (input) {
		const acceptedDelimiters = ['-', '/', ' '];
		acceptedDelimiters.forEach(d => {
			const splitInput = input.split(d);
			if (splitInput.length === 3 && splitInput.every(val => !isNaN(+val))) {
				// Will never be empty but ts doesn't know that
				splitInput.unshift(splitInput.pop() || '');
				// For parsing consistency across browsers
				parsedInput = moment(splitInput.join('-'), 'YYYY-MM-DD');
			}
		});
	}
	return parsedInput;
};
