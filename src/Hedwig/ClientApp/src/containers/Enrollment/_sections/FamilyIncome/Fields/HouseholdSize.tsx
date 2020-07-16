import FormField from '../../../../../components/Form_New/FormField';
import React, { ChangeEvent } from 'react';
import { Enrollment } from '../../../../../generated';
import { TextInputProps, TextInput } from '@ctoec/component-library';
import { displayValidationStatus } from '../../../../../utils/validations/displayValidationStatus';
import { FamilyIncomeFormFieldProps } from './common';
import { errorDisplayGuard } from '../../../../../utils/validations';

export const HouseholdSizeField: React.FC<FamilyIncomeFormFieldProps> = ({
	determinationId,
	blockErrorDisplay = false,
}) => {
	return (
		<FormField<Enrollment, TextInputProps, number | null>
			getValue={(data) =>
				data
					.at('child')
					.at('family')
					.at('determinations')
					.find((det) => det.id === determinationId)
					.at('numberOfPeople')
			}
			parseOnChangeEvent={(e: ChangeEvent<HTMLInputElement>) =>
				parseInt(e.target.value, 10) || null
			}
			defaultValue={undefined}
			inputComponent={TextInput}
			status={(data) =>
				errorDisplayGuard(
					blockErrorDisplay,
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
							field: 'numberOfPeople',
						},
					])
				)
			}
			id={`number-of-people-${determinationId}`}
			label="Household size"
			small
		/>
	);
};
