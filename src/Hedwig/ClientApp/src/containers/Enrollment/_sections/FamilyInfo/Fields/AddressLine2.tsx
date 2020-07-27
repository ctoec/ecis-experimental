import { FamilyInfoFormFieldProps } from './common';
import { TextInput, TextInputProps, FormField } from '@ctoec/component-library';
import React from 'react';
import { Enrollment } from '../../../../../generated';

export const AddressLine2: React.FC<FamilyInfoFormFieldProps> = () => (
	<FormField<Enrollment, TextInputProps, string | null>
		getValue={(data) => data.at('child').at('family').at('addressLine2')}
		type="input"
		inputComponent={TextInput}
		id="addressLine2"
		label="Address line 2"
		parseOnChangeEvent={(e) => e.target.value}
		optional
	/>
);
