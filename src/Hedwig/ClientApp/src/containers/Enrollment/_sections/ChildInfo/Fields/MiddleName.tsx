import React from 'react';
import FormField from '../../../../../components/Form_New/FormField';
import { Enrollment } from '../../../../../generated';
import { TextInputProps, TextInput } from '@ctoec/component-library';

/**
 * Component for entering the middle name of a child in an enrollment.
 */
export const MiddleNameField: React.FC = () => {
	return (
		<FormField<Enrollment, TextInputProps, string | null>
			getValue={(data) => data.at('child').at('middleName')}
			defaultValue=""
			parseOnChangeEvent={(e) => e.target.value}
			inputComponent={TextInput}
			type="input"
			id="middleName"
			label="Middle name"
			optional
		/>
	);
};
