import pluralize from 'pluralize';
import { DateRange } from '../components/DatePicker/DatePicker';

export default function enrollmentTextFormatter(
	numKids: number,
	showPastEnrollments: boolean,
	currentDateRange: DateRange,
	byRange: boolean
) {
	const pluralizedNumKids = pluralize('child', numKids, true);

	const formattedStartDate =
		currentDateRange.startDate && currentDateRange.startDate.format('MMMM D, YYYY');
	const formattedEndDate =
		currentDateRange.endDate && currentDateRange.endDate.format('MMMM D, YYYY');

	if (!showPastEnrollments) {
		return `${pluralizedNumKids} enrolled.`;
	} else if (byRange) {
		return `${pluralizedNumKids} ${
			numKids === 1 ? 'was' : 'were'
		} enrolled between ${formattedStartDate} and ${formattedEndDate}.`;
	}
	return `${pluralizedNumKids} ${
		numKids === 1 ? 'was' : 'were'
	} enrolled on ${formattedStartDate}.`;
}
