import moment from 'moment';

export const beforeDate = (array: Date[], date: Date) => {
	return array.filter(obj => moment(obj).isBefore(date));
};

export const propertyBeforeDate = <T>(array: T[], accessor: (_: T) => Date, date: Date) => {
	return array.filter(obj => moment(accessor(obj)).isBefore(date));
};

export const afterDate = (array: Date[], date: Date) => {
	return array.filter(obj => moment(obj).isAfter(date));
};

export const propertyAfterDate = <T>(array: T[], accessor: (_: T) => Date, date: Date) => {
	return array.filter(obj => moment(accessor(obj)).isAfter(date));
};

export const betweenDates = (array: Date[], startDate: Date, endDate: Date) => {
	return array.filter(obj => moment(obj).isAfter(startDate) && moment(obj).isBefore(endDate));
};

export const propertyBetweenDates = <T>(
	array: T[],
	accessor: (_: T) => Date,
	startDate: Date,
	endDate: Date
) => {
	return array.filter(
		obj => moment(accessor(obj)).isAfter(startDate) && moment(accessor(obj)).isBefore(endDate)
	);
};
