import React from 'react';
import { DateInputProps, DateInput } from "../../../../../components"
import FormField from '../../../../../components/Form_New/FormField';
import { Enrollment } from '../../../../../generated';
import { displayValidationStatus } from '../../../../../utils/validations/displayValidationStatus';
import { initialLoadErrorGuard } from '../../../../../utils/validations';

export const StartDateField: React.FC<{ initialLoad: boolean}> = ({ initialLoad }) => {
	return (
		<div>
			<FormField<Enrollment, DateInputProps, Date | null>
				getValue={(data) => data.at('entry')}
				parseOnChangeEvent={(e) => e.target.value ? new Date(parseInt(e.target.value)) : null}
				inputComponent={DateInput}
				status={(data) => 
					initialLoadErrorGuard(
						initialLoad,
						displayValidationStatus([
							{
								type: 'warning',
								response: data.at('validationErrors').value,
								field: 'entry'
							}
						])
					)
				}
				label="Start date"
				id="start-date"
			/>
		</div>
	)
}
