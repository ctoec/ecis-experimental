import { FamilyInfoFormFieldProps } from './common';
import { TextInput, TextInputProps } from '@ctoec/component-library';
import React from 'react';
import { errorDisplayGuard } from '../../../../../utils/validations';
import { displayValidationStatus } from '../../../../../utils/validations/displayValidationStatus';
// TODO
import FormField from '../../../../../components/Form_New/FormField';
import { Enrollment } from '../../../../../generated';

export const Town: React.FC<FamilyInfoFormFieldProps> = ({ blockErrorDisplay = false }) => (
	<FormField<Enrollment, TextInputProps, string | null>
		getValue={(data) => data.at('child').at('family').at('town')}
		type="input"
		inputComponent={TextInput}
		id="town"
		label="Town"
		parseOnChangeEvent={(e) => e.target.value}
		status={(enrollment) =>
			errorDisplayGuard(
				blockErrorDisplay,
				displayValidationStatus([
					{
						type: 'warning',
						response: enrollment.at('child').at('family').at('validationErrors').value || null,
						field: 'town',
					},
				])
			)
		}
	/>
);
