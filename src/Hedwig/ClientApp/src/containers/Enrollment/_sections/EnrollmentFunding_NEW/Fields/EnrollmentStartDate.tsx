import React from 'react';
import { DateInputProps, DateInput } from '../../../../../components';
import FormField from '../../../../../components/Form_New/FormField';
import { Enrollment } from '../../../../../generated';
import { displayValidationStatus } from '../../../../../utils/validations/displayValidationStatus';
import { initialLoadErrorGuard } from '../../../../../utils/validations';
import { EnrollmentFormFieldProps } from './common';

export const EnrollmentStartDate: React.FC<EnrollmentFormFieldProps> = ({ initialLoad }) => {
	return (
		<div>
			<FormField<Enrollment, DateInputProps, Date | null>
				getValue={(data) => data.at('entry')}
				parseOnChangeEvent={(e) => (e.target.value ? new Date(parseInt(e.target.value)) : null)}
				inputComponent={DateInput}
				status={(data) =>
					initialLoadErrorGuard(
						initialLoad || false,
						displayValidationStatus([
							{
								type: 'warning',
								response: data.at('validationErrors').value,
								field: 'entry',
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
