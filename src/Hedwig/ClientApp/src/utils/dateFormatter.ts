import moment, { Moment } from 'moment';

export default function dateFormatter(date?: string | null | Date | Moment, short: boolean = true) {
	if (!date) {
		return '';
	}

	if(short) return moment(date).format('MM/DD/YYYY');

	return moment(date).format('MMMM Do, YYYY');
}
