import FormField from '../../../../../components/Form_New/FormField';
import React, { ChangeEvent } from 'react';
import { Enrollment } from '../../../../../generated';
import { TextInputProps, TextInput } from '../../../../../components';
import { displayValidationStatus } from '../../../../../utils/validations/displayValidationStatus';

export const HouseholdSizeField: React.FC<{ id: number }> = ({ id }) => {
	return (
		<div>
			<FormField<Enrollment, TextInputProps, number | null>
				getValue={(data) =>
					data
						.at('child')
						.at('family')
						.at('determinations')
						.find((det) => det.id === id)
						.at('numberOfPeople')
				}
				parseOnChangeEvent={(e: ChangeEvent<HTMLInputElement>) => parseInt(e.target.value, 10)}
				defaultValue={undefined}
				inputComponent={TextInput}
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
							field: 'numberOfPeople',
						},
					])
				}
				id={`number-of-people-${id}`}
				label="Household size"
				small
			/>
		</div>
	);
};
