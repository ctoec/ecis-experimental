import { FamilyInfoFormFieldProps } from './common';
import { TextInput, TextInputProps } from '../../../../../components';
import React from 'react';
import { initialLoadErrorGuard } from '../../../../../utils/validations';
import { displayValidationStatus } from '../../../../../utils/validations/displayValidationStatus';
import FormField from '../../../../../components/Form_New/FormField';
import { Enrollment } from '../../../../../generated';

export const Zip: React.FC<FamilyInfoFormFieldProps> = ({
	errorDisplayGuard = false
}) => (
	<FormField<Enrollment, TextInputProps, string | null>
		getValue={(data) => data.at('child').at('family').at('zip')}
		type="input"
		inputComponent={TextInput}
		id="zip"
		label="ZIP Code"
		parseOnChangeEvent={(e) => e.target.value}
		status={(enrollment) =>
			initialLoadErrorGuard(
				errorDisplayGuard,
				displayValidationStatus([
					{
						type: 'warning',
						response: enrollment.at('child').at('family').at('validationErrors').value || null,
						field: 'zip',
					},
				])
			)
		}
	/>
);
