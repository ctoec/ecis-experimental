import React, { useState } from 'react';
import moment from 'moment';
import { DatePicker, DateRange } from '../../components/DatePicker/DatePicker';
import Button from '../../components/Button/Button';
import dateFormatter from '../../utils/dateFormatter';

type DateSelectionFormProps = {
	onSubmit: (newDateRange: DateRange) => any;
	onReset: () => any;
	inputDateRange: DateRange;
	byRange: boolean;
};

export default function DateSelectionForm({
	onSubmit,
	onReset,
	inputDateRange,
	byRange,
}: DateSelectionFormProps) {
	const [currentDateRange, setDateRange] = useState<DateRange>(inputDateRange);

	return (
		<form className="usa-form">
			<DatePicker
				byRange={byRange}
				onChange={newRange => setDateRange(newRange)}
				dateRange={currentDateRange}
				possibleRange={{ startDate: null, endDate: moment().local() }}
			/>
			<div>
				<Button
					text="Update"
					onClick={() => onSubmit(currentDateRange)}
					disabled={
						dateFormatter(currentDateRange.startDate) === dateFormatter(inputDateRange.startDate) &&
						dateFormatter(currentDateRange.endDate) === dateFormatter(inputDateRange.endDate)
					}
				/>
				<Button
					text="Reset"
					onClick={onReset}
				/>
			</div>
		</form>
	);
}
