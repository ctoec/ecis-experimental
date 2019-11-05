interface Name {
	firstName: string;
	middleName?: string | null;
	lastName: string;
	suffix?: string | null;
}

export default function nameFormatter(name?: Name | null) {
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
