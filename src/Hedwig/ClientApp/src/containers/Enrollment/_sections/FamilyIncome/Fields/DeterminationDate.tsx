import FormField from '../../../../../components/Form_New/FormField';
import React from 'react';
import { Enrollment } from '../../../../../generated';
import { DateInput, DateInputProps } from '../../../../../components';
import { displayValidationStatus } from '../../../../../utils/validations/displayValidationStatus';

export const DeterminationDateField: React.FC<{ id: number }> = ({ id }) => {
	return (
		<div>
			<FormField<Enrollment, DateInputProps, Date | null>
				getValue={(data) =>
					data
						.at('child')
						.at('family')
						.at('determinations')
						.find((det) => det.id === id)
						.at('determinationDate')
				}
				parseOnChangeEvent={(e) => (e as any).toDate()}
				inputComponent={DateInput}
				status={(data) =>
					displayValidationStatus([
						{
							type: 'warning',
							response:
								data
									.at('child')
									.at('family')
									.at('determinations')
									.find((det) => det.id === id)
									.at('validationErrors').value || null,
							field: 'determinationDate',
						},
					])
				}
				id={`determination-date-${id}`}
				label="Determination date"
			/>
		</div>
	);
};
