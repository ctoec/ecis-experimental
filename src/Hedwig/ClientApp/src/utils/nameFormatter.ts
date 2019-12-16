import { Child } from '../generated/models/Child';

// TODO: FIX THIS
interface Name {
	firstName: string | null;
	middleName: string | null;
	lastName: string | null;
	suffix: string | null;
}

export default function nameFormatter(name?: Name) {
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
