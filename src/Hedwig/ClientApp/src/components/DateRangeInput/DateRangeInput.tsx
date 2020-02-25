import React from 'react';
import { Moment } from 'moment';
import cx from 'classnames';
import { FieldSet, DateInput, DateInputProps } from '..';
import { ReactComponent as ArrowIcon } from '../../assets/images/arrowRight.svg';

export type DateRange = {
	startDate: Moment | null;
	endDate: Moment | null;
};

type DateRangeInputProps = Omit<DateInputProps, 'onChange'> & {
	dateRange: DateRange;
	onChange: (newDateRange: DateRange | null) => void;
	possibleRange?: DateRange;
	date?: never;
};

export const DateRangeInput: React.FC<DateRangeInputProps> = ({
	dateRange,
	possibleRange,
	onChange,
	id,
	label,
	disabled,
	optional,
	status,
	className,
}) => {
	return (
		<FieldSet
			legend={label}
			id={`${id}-outer-fieldset`}
			disabled={disabled}
			hint="For example: 04/28/1986"
			optional={optional}
			showLegend
			status={status}
			className={cx('oec-date-range-input', className)}
		>
			<div className="display-flex flex-direction-row flex-align-end">
				<DateInput
					hideHint
					date={dateRange.startDate}
					onChange={newStartDate =>
						onChange({ startDate: newStartDate, endDate: dateRange.endDate })
					}
					id={`${id}-start-date`}
					label="Start date"
				/>
				<div className="oec-date-range-input__arrow">
					<ArrowIcon />
				</div>
				<DateInput
					hideHint
					date={dateRange.endDate}
					onChange={newEndDate => onChange({ startDate: dateRange.startDate, endDate: newEndDate })}
					id={`${id}-end-date`}
					label="End date"
				/>
			</div>
		</FieldSet>
	);
};
