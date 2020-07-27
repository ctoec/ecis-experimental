import { FamilyInfoFormFieldProps } from './common';
import React from 'react';
import { errorDisplayGuard } from '../../../../../utils/validations';
import { displayValidationStatus } from '../../../../../utils/validations/displayValidationStatus';
import { SelectProps, Select, FormField } from '@ctoec/component-library';
import { Enrollment } from '../../../../../generated';

const possibleStates = ['CT', 'MA', 'NY', 'RI'];

export const State: React.FC<FamilyInfoFormFieldProps> = ({ blockErrorDisplay = false }) => (
	<FormField<Enrollment, SelectProps, string>
		id="state"
		label="State"
		inputComponent={Select}
		getValue={(data) => data.at('child').at('family').at('state')}
		parseOnChangeEvent={(e) => e.target.value}
		options={possibleStates.map((state) => ({ text: state, value: state }))}
		name="state"
		status={(enrollment) =>
			errorDisplayGuard(
				blockErrorDisplay,
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
