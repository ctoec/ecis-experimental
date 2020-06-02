import FormField from '../../../../../components/Form_New/FormField';
import React from 'react';
import { Enrollment } from '../../../../../generated';
import { DateInput, DateInputProps } from '../../../../../components';
import { displayValidationStatus } from '../../../../../utils/validations/displayValidationStatus';
import { FamilyIncomeFormFieldProps } from './common';

export const DeterminationDateField: React.FC<FamilyIncomeFormFieldProps> = ({
	determinationId,
}) => {
	return (
		<FormField<Enrollment, DateInputProps, Date | null>
			getValue={(data) =>
				data
					.at('child')
					.at('family')
					.at('determinations')
					.find((det) => det.id === determinationId)
					.at('determinationDate')
			}
			parseOnChangeEvent={(e) => e.target.value ? new Date(parseInt(e.target.value)) : null}
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
								.find((det) => det.id === determinationId)
								.at('validationErrors').value || null,
						field: 'determinationDate',
					},
				])
			}
			id={`determination-date-${determinationId}`}
			label="Determination date"
		/>
	);
};
