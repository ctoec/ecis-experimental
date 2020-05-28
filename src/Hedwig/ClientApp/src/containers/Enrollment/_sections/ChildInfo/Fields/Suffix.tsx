import React from 'react';
import FormField from '../../../../../components/Form_New/FormField';
import { Enrollment } from '../../../../../generated';
import { TextInputProps, TextInput } from '../../../../../components';

/**
 * Component for entering the suffix of a child in an enrollment.
 */
export const SuffixField: React.FC = () => {
	return (
		<FormField<Enrollment, TextInputProps, string | null>
			getValue={(data) => data.at('child').at('suffix')}
			defaultValue=""
			parseOnChangeEvent={(e) => e.target.value}
			inputComponent={TextInput}
			type="input"
			id="suffix"
			label="Suffix"
			optional
		/>
	);
};
