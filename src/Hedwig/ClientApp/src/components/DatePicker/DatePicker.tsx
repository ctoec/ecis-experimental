import React from 'react';
import moment, { Moment } from 'moment';
import { DateRangePicker, SingleDatePicker } from 'react-dates';

export type DateRange = {
	startDate: Moment | null;
	endDate: Moment | null;
};

type DatePickerProps = {
	onChange: (newRange: DateRange) => any;
	dateRange: DateRange;
	byRange?: boolean;
	possibleRange?: DateRange;
};

type DatePickerState = {
	selectedRange: DateRange;
	datePickerFocused: 'startDate' | 'endDate' | null;
};

export class DatePicker extends React.Component<DatePickerProps, DatePickerState> {
	constructor(props: DatePickerProps) {
		super(props);

		this.state = {
			selectedRange: props.dateRange,
			datePickerFocused: null,
		};

		this.resetState = this.resetState.bind(this);
		this.setDateRange = this.setDateRange.bind(this);
		this.isOutsidePossibleRange = this.isOutsidePossibleRange.bind(this);
	}

	resetState() {
		const now = moment().local();
		const newRange = { startDate: now, endDate: now };
		this.setState(
			{
				selectedRange: newRange,
				datePickerFocused: null,
			},
			this.props.onChange(newRange)
		);
	}

	setDateRange(input: DateRange) {
		this.setState({ selectedRange: input }, this.props.onChange(input));
	}

	isOutsidePossibleRange(candidateDate: Moment) {
		if (!this.props.possibleRange) {
			return false;
		}
		const { startDate, endDate } = this.props.possibleRange;
		if (startDate && candidateDate.isBefore(startDate)) {
			return true;
		}
		if (endDate && candidateDate.isAfter(endDate)) {
			return true;
		}
		return false;
	}

	render() {
		const { byRange } = this.props;
		const { selectedRange, datePickerFocused } = this.state;

		return (
			<fieldset className="usa-fieldset">
				<legend className="usa-sr-only">{`Choose a date${byRange ? ' range' : ''}`}</legend>
				{byRange && (
					<DateRangePicker
						startDate={selectedRange.startDate}
						startDateId="startDate"
						endDate={selectedRange.endDate}
						endDateId="endDate"
						focusedInput={datePickerFocused}
						onDatesChange={dates => this.setDateRange(dates)}
						onFocusChange={(focused: any) => this.setState({ datePickerFocused: focused })}
						isOutsideRange={date => {
							return this.isOutsidePossibleRange(date);
						}}
						initialVisibleMonth={() => moment().subtract(1, 'M')}
					/>
				)}
				{!byRange && (
					<SingleDatePicker
						id="date"
						date={selectedRange.startDate}
						focused={datePickerFocused === 'startDate'}
						onDateChange={date => this.setDateRange({ startDate: date, endDate: date })}
						onFocusChange={({ focused }: any) =>
							this.setState({ datePickerFocused: focused ? 'startDate' : null })
						}
						isOutsideRange={date => {
							return this.isOutsidePossibleRange(date);
						}}
						initialVisibleMonth={() => moment().subtract(1, 'M')}
					/>
				)}
			</fieldset>
		);
	}
}

export default DatePicker;
