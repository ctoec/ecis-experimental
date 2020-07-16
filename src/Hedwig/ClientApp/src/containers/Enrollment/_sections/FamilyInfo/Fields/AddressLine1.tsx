import { FamilyInfoFormFieldProps } from './common';
import { TextInput, TextInputProps, FormField } from '@ctoec/component-library';
import React from 'react';
import { errorDisplayGuard } from '../../../../../utils/validations';
import { displayValidationStatus } from '../../../../../utils/validations/displayValidationStatus';
import { Enrollment } from '../../../../../generated';

export const AddressLine1: React.FC<FamilyInfoFormFieldProps> = ({ blockErrorDisplay = false }) => (
	<FormField<Enrollment, TextInputProps, string | null>
		getValue={(data) => data.at('child').at('family').at('addressLine1')}
		type="input"
		inputComponent={TextInput}
		id="addressLine1"
		label="Address line 1"
		parseOnChangeEvent={(e) => e.target.value}
		status={(enrollment) =>
			errorDisplayGuard(
				blockErrorDisplay,
				displayValidationStatus([
					{
						type: 'warning',
						response: enrollment.at('child').at('family').at('validationErrors').value || null,
						field: 'addressline1',
					},
				])
			)
		}
	/>
);
