import { Child } from '../OAS-generated/models/Child';

interface Name {
	firstName: string;
	middleName?: string | null;
	lastName: string;
	suffix?: string | null;
}

// TODO: FIX THIS
export default function nameFormatter(name?: Child | null | Name) {
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
