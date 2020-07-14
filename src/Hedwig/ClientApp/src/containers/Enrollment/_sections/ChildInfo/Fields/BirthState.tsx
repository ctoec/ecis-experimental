import React from 'react';
import FormField from '../../../../../components/Form_New/FormField';
import { Enrollment } from '../../../../../generated';
import { TextInputProps, TextInput } from '@ctoec/component-library';
import { ChildInfoFormFieldProps } from './common';
import { errorDisplayGuard } from '../../../../../utils/validations';
import { displayValidationStatus } from '../../../../../utils/validations/displayValidationStatus';

/**
 * Component for entering the birth state of a child in an enrollment.
 */
export const BirthStateField: React.FC<ChildInfoFormFieldProps> = ({
	blockErrorDisplay = false,
}) => {
	return (
		<FormField<Enrollment, TextInputProps, string | null>
			getValue={(data) => data.at('child').at('birthState')}
			parseOnChangeEvent={(e) => e.target.value}
			inputComponent={TextInput}
			type="input"
			id="birthState"
			label="State"
			status={(enrollment) =>
				errorDisplayGuard(
					blockErrorDisplay,
					displayValidationStatus([
						{
							type: 'warning',
							response: enrollment.at('child').at('validationErrors').value || null,
							field: 'birthState',
						},
					])
				)
			}
		/>
	);
};
