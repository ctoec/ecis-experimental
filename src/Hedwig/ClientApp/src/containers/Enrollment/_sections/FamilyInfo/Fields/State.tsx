import { FamilyInfoFormFieldProps } from './common';
import React from 'react';
import { initialLoadErrorGuard } from '../../../../../utils/validations';
import { displayValidationStatus } from '../../../../../utils/validations/displayValidationStatus';
import { SelectProps, Select } from '../../../../../components/Select/Select';
import FormField from '../../../../../components/Form_New/FormField';
import { Enrollment } from '../../../../../generated';

export const State: React.FC<FamilyInfoFormFieldProps> = ({ initialLoad }) => (
	<FormField<Enrollment, SelectProps, string>
		id="state"
		label="State"
		inputComponent={Select}
		getValue={(data) => data.at('child').at('family').at('state')}
		parseOnChangeEvent={(e) => e.target.value}
		options={['CT', 'MA', 'NY', 'RI'].map((state) => ({ text: state, value: state }))}
		name="state"
		status={(enrollment) =>
			initialLoadErrorGuard(
				initialLoad || false,
				displayValidationStatus([
					{
						type: 'warning',
						response: enrollment.at('child').at('family').at('validationErrors').value || null,
						field: 'state',
					},
				])
			)
		}
	/>
);
