import { Child } from '../../generated/models/Child';

export function nameFormatter(name?: Child) {
	if (!name) {
		return '';
	}

	return (
		name.firstName +
		' ' +
		(name.middleName || '') +
		' ' +
		name.lastName +
		(name.suffix ? ', ' : '') +
		(name.suffix || '')
	).replace(/ +/g, ' ');
}

export function lastFirstNameFormatter(name?: Child) {
	if (!name) {
		return '';
	}

	// TODO: IF FIRST NAME IS UNDEFINED THIS FORMATTING IS SILLY
	return (
		name.lastName +
		', ' +
		name.firstName +
		(name.middleName ? ' ' : '') +
		(name.middleName || '') +
		(name.suffix ? ', ' : '') +
		(name.suffix || '')
	);
}
