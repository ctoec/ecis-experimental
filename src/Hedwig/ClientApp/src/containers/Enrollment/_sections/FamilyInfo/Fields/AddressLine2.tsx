import { FamilyInfoFormFieldProps } from './common';
import { TextInput, TextInputProps } from '../../../../../components';
import React from 'react';
import FormField from '../../../../../components/Form_New/FormField';
import { Enrollment } from '../../../../../generated';

export const AddressLine1: React.FC<FamilyInfoFormFieldProps> = () => (
	<FormField<Enrollment, TextInputProps, string | null>
		getValue={(data) => data.at('child').at('family').at('addressLine2')}
		type="input"
		inputComponent={TextInput}
		id="addressLine2"
		label="Address line 2"
		parseOnChangeEvent={(e) => e.target.value}
	/>
);
