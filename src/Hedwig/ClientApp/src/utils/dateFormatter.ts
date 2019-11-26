export default function dateFormatter(date?: string | null | Date) {
  // TODO: USE MOMENT MAYBE?
	if (!date) {
		return '';
	}

	const [yyyy, mm, dd] = date.toString().split('-');
	return `${mm}/${dd}/${yyyy}`;
}
