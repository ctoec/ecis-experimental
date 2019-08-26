export default function dateFormatter(date?: string) {
	if (!date) {
		return '';
	}

	const [yyyy, mm, dd] = date.split('-');
	return `${mm}/${dd}/${yyyy}`;
}
