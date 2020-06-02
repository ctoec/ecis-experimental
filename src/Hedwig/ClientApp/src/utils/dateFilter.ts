import moment from 'moment';

export const beforeDate = (array: Date[], date: Date) => {
	return array.filter((obj) => moment(obj).isBefore(date));
};

export const propertyBeforeDate = <T>(array: T[], accessor: (_: T) => Date, date: Date) => {
	return array.filter((obj) => moment(accessor(obj)).isBefore(date));
};

export const afterDate = (array: Date[], date: Date) => {
	return array.filter((obj) => moment(obj).isAfter(date));
};

export const betweenDates = (array: Date[], startDate: Date, endDate: Date) => {
	return array.filter((obj) => moment(obj).isAfter(startDate) && moment(obj).isBefore(endDate));
};

export const propertyBetweenDates = <T>(
	array: T[],
	accessor: (_: T) => Date,
	startDate: Date,
	endDate: Date
) => {
	return array.filter(
		(obj) => moment(accessor(obj)).isAfter(startDate) && moment(accessor(obj)).isBefore(endDate)
	);
};

export const isWithinFiscalYear = (date: Date | undefined, fiscalYearDate: Date) => {
	if (!date) {
		return false;
	}
	const _fiscalYearDate = moment(fiscalYearDate);
	const month = _fiscalYearDate.month();
	let fiscalYearStart = _fiscalYearDate.year();
	if (month < 7) {
		--fiscalYearStart;
	}
	const _date = moment(date);
	return (
		_date.isSameOrAfter(new Date(fiscalYearStart, 7, 1)) &&
		_date.isSameOrBefore(new Date(fiscalYearStart + 1, 6, 30))
	);
};
