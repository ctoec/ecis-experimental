import React from 'react';
import { DateInputProps, DateInput } from '../../../../../components';
import { Enrollment } from '../../../../../generated';
import { displayValidationStatus } from '../../../../../utils/validations/displayValidationStatus';
import { errorDisplayGuard } from '../../../../../utils/validations';
import { EnrollmentFormFieldProps } from './common';
import { FormField, parseDateChange } from '@ctoec/component-library';

type EnrollmentStartDateFieldProps = EnrollmentFormFieldProps & {
	setExternalStartDate?: React.Dispatch<React.SetStateAction<Date>>;
};

/**
 * This component is used in EnrollmentUdpate when a new enrollment is created, or to edit
 * an existing enrollment. It accepts an optional function to update an external Date state
 * variable, for instances when the value of the enrollment's start date affects state
 * outside of the new enrollment form (specifically, when creating a new enrollment: the start
 * date will affect the previously current enrollment's end date)
 */
export const EnrollmentStartDateField: React.FC<EnrollmentStartDateFieldProps> = ({
	blockErrorDisplay = false,
	error,
	errorAlertState,
	setExternalStartDate,
}) => {
	return (
		<div>
			<FormField<Enrollment, DateInputProps, Date | null>
				getValue={(data) => data.at('entry')}
				parseOnChangeEvent={(e) => {
					const startDate = parseDateChange(e);
					if (setExternalStartDate && startDate) {
						setExternalStartDate(startDate);
					}
					return startDate;
				}}
				inputComponent={DateInput}
				status={(data) =>
					errorDisplayGuard(
						blockErrorDisplay,
						displayValidationStatus([
							{
								type: 'warning',
								response: data.at('validationErrors').value,
								field: 'entry',
							},
							{
								type: 'error',
								response: error,
								field: 'fundings',
								errorAlertState,
								message: 'Start date must be before earliest funding first reporting period',
							},
						])
					)
				}
				label="Start date"
				id="start-date"
			/>
		</div>
	);
};
