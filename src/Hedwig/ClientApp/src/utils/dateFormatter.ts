import moment, { Moment } from 'moment';

export default function dateFormatter(date?: string | null | Date | Moment) {
	if (!date) {
		return '';
	}

	return moment(date).format('MM/DD/YYYY');
}
