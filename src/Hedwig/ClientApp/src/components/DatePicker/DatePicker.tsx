import React from 'react';
import moment, { Moment } from 'moment';
import { DateRangePicker, SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import RadioGroup from '../RadioGroup/RadioGroup';
import Button from '../Button/Button';

type DatePickerProps = {
  onSubmit: () => any;
};

type DatePickerState = {
  byRange: boolean,
  selectedDate: Moment,
  selectedRange: { startDate: Moment, endDate: Moment },
  datePickerFocused: 'startDate' | 'endDate' | null,
};

// TODO: move this to resetState, and call that in component will mount or something?
const defaultState = {
  byRange: false,
  selectedDate: moment().local(),
  selectedRange: { startDate: moment().local(), endDate: moment().local() },
  datePickerFocused: null,
};

export class DatePicker extends React.Component<DatePickerProps, DatePickerState> {
  constructor(props: DatePickerProps) {
    super(props);
    this.state = defaultState;
    this.resetState = this.resetState.bind(this);
    this.toggleDateRange = this.toggleDateRange.bind(this);
    this.setDate = this.setDate.bind(this);
    this.setDateRange = this.setDateRange.bind(this);
  }

  resetState() {
    this.setState(defaultState);
  }

  toggleDateRange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value === 'range') {
      this.setState({ byRange: true })
    } else {
      this.setState({ byRange: false })
    }
  }

  setDate(input: any) {
    this.setState({ selectedDate: input });
  }

  setDateRange(input: any) {
    this.setState({ selectedRange: input });
  }

  render() {
    const { onSubmit } = this.props;
    const { byRange, selectedDate, selectedRange, datePickerFocused } = this.state;

    // TODO: fix ids of date picker elements-- bring into line with how ids are set for other components
    return (
      <form className="usa-form">
        <fieldset className="usa-fieldset">
          <legend className="usa-sr-only">Choose a date or date range</legend>
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
            onClick={this.toggleDateRange}
            horizontal={true}
            groupName={'dateSelectionType'}
          />
          {byRange &&
            <DateRangePicker
              startDate={selectedRange.startDate}
              startDateId="startDate"
              endDate={selectedRange.endDate}
              endDateId="endDate"
              focusedInput={datePickerFocused}
              onDatesChange={(dates) => this.setDateRange(dates)}
              onFocusChange={( focused: any) => this.setState({ datePickerFocused: focused }) }
              isOutsideRange={() => false}
            />
          }
          {!byRange &&
            <SingleDatePicker
              id="date"
              date={selectedDate}
              focused={datePickerFocused === 'startDate'}
              onDateChange={date => this.setDate(date)}
              onFocusChange={({ focused }: any) => this.setState({ datePickerFocused: focused ? 'startDate' : null })}
              isOutsideRange={() => false}
            />
          }
          <div>
            <Button text="Update" onClick={onSubmit} />
            <Button text="Reset" onClick={this.resetState} />
          </div>
        </fieldset> 
      </form>
    )
  }
}

export default DatePicker;
