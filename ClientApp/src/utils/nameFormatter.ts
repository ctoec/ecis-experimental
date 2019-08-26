type Name = {
	firstName: string;
	middleName?: string;
	lastName: string;
	suffix?: string;
};

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
