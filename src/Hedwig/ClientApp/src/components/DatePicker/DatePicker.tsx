import React from 'react';
import moment, { Moment } from 'moment';
import { DateRangePicker, SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';

export type DateRange = {
	startDate: Moment | null;
	endDate: Moment | null;
}

type DatePickerProps = {
	onReset: (newRange: DateRange) => any;
	dateRange: DateRange;
	byRange: boolean;
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
	}

	resetState() {
		const now = moment().local();
		const newRange = { startDate: now, endDate: now };
		this.setState(
			{
				selectedRange: newRange,
				datePickerFocused: null,
			},
			this.props.onReset(newRange)
		);
	}

	setDateRange(input: DateRange) {
		this.setState({ selectedRange: input });
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
            isOutsideRange={() => false}
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
            isOutsideRange={() => false}
          />
        )}
      </fieldset>
		);
	}
}

export default DatePicker;
