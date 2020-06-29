import FormField from '../../../../../components/Form_New/FormField';
import React from 'react';
import { Enrollment } from '../../../../../generated';
import { DateInput, DateInputProps } from '../../../../../components';
import { displayValidationStatus } from '../../../../../utils/validations/displayValidationStatus';
import { FamilyIncomeFormFieldProps } from './common';
import { parseDateChange } from '../../../../../components/Form_New';
import { initialLoadErrorGuard } from '../../../../../utils/validations';

export const DeterminationDateField: React.FC<FamilyIncomeFormFieldProps> = ({
	determinationId,
	errorDisplayGuard = false,
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
			parseOnChangeEvent={parseDateChange}
			inputComponent={DateInput}
			status={(data) =>
				initialLoadErrorGuard(
					errorDisplayGuard,
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
				)
			}
			id={`determination-date-${determinationId}`}
			label="Determination date"
		/>
	);
};
