import moment, { Moment } from 'moment';

export default function monthFormatter(date?: Date | string | null) {
	if (!date) {
		return '';
	}

	return moment(date).format('MMMM YYYY')
}
