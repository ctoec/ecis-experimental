import React from 'react';
import { DateInputProps, DateInput } from '../../../../../components';
import FormField from '../../../../../components/Form_New/FormField';
import { Enrollment } from '../../../../../generated';
import { displayValidationStatus } from '../../../../../utils/validations/displayValidationStatus';
import { initialLoadErrorGuard } from '../../../../../utils/validations';
import { EnrollmentFormFieldProps } from './common';
import { parseDateChange } from '../../../../../components/Form_New';

export const EnrollmentStartDate: React.FC<EnrollmentFormFieldProps> = ({
	errorDisplayGuard = false,
	error,
	errorAlertState,
}) => {
	return (
		<div>
			<FormField<Enrollment, DateInputProps, Date | null>
				getValue={(data) => data.at('entry')}
				parseOnChangeEvent={parseDateChange}
				inputComponent={DateInput}
				status={(data) =>
					initialLoadErrorGuard(
						errorDisplayGuard,
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
