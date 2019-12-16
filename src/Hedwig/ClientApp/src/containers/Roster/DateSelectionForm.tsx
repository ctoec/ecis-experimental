import React, { useState } from 'react';
import moment from 'moment';
import { DatePicker, DateRange } from '../../components/DatePicker/DatePicker';

type DateSelectionFormProps = {
	onSubmit: (newDateRange: DateRange) => any;
	inputDateRange: DateRange;
	byRange: boolean;
};

export default function DateSelectionForm({
	onSubmit,
	inputDateRange,
	byRange,
}: DateSelectionFormProps) {
	const [currentDateRange, setDateRange] = useState<DateRange>(inputDateRange);

	return (
		<DatePicker
			byRange={byRange}
			onChange={newRange => {
				setDateRange(newRange);
				onSubmit(newRange);
			}}
			dateRange={currentDateRange}
			possibleRange={{ startDate: null, endDate: moment().local() }}
		/>
	);
}
