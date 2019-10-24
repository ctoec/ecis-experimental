import React, { useState } from 'react';
import { DatePicker, DateRange } from '../../components/DatePicker/DatePicker';
import RadioGroup from '../../components/RadioGroup/RadioGroup';
import Button from '../../components/Button/Button';

type DateSelectionFormProps = {
	onSubmit: (dateRange: DateRange) => any;
}

export default function DateSelectionForm({ onSubmit }: DateSelectionFormProps) {

  const [byRange, toggleByRange] = useState(false);

  function handleToggleByRange(newByRange: boolean) {
    toggleByRange(newByRange);
  }

  return (
		<form className="usa-form">
			<RadioGroup
				options={[
					{
						text: 'By date',
						value: 'date',
						selected: !byRange,
					},
					{
						text: 'By range',
						value: 'range',
						selected: byRange,
					},
				]}
				onClick={(clickedValue: string) => handleToggleByRange(clickedValue === 'range')}
				horizontal={true}
				groupName={'dateSelectionType'}
				legend="Select date or date range."
			/>
			<DatePicker
				byRange={byRange}
				onSubmit={dateRange => handleDateRangeChange(dateRange)}
				dateRange={currentDateRange}
				onReset={newRange => {
					handleToggleByRange(false);
					handleDateRangeChange(newRange);
				}}
			/>
			<div>
				<Button
					text="Update"
					onClick={() => onSubmit(selectedRange)}
					disabled={
						selectedRange.startDate === dateRange.startDate &&
						selectedRange.endDate === dateRange.endDate
					}
				/>
				<Button text="Reset" onClick={this.resetState} />
			</div>
		</form>
	);
}