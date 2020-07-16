import React from 'react';
import { Enrollment } from '../../../../../generated';
import { TextInputProps, TextInput, FormField } from '@ctoec/component-library';

/**
 * Component for entering the SASID of a child in an enrollment.
 */
export const SasidField: React.FC = () => {
	return (
		<FormField<Enrollment, TextInputProps, string | null>
			getValue={(data) => data.at('child').at('sasid')}
			parseOnChangeEvent={(e) => e.target.value}
			inputComponent={TextInput}
			type="input"
			id="sasid"
			label="SASID"
			optional
		/>
	);
};
