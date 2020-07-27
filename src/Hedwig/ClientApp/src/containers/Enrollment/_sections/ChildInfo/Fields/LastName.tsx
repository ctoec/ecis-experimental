import React from 'react';
import { Enrollment } from '../../../../../generated';
import { TextInputProps, TextInput, FormField } from '@ctoec/component-library';
import { ChildInfoFormFieldProps } from './common';
import { displayValidationStatus } from '../../../../../utils/validations/displayValidationStatus';
import { REQUIRED_FOR_ENROLLMENT } from '../../../../../utils/validations/messageStrings';

/**
 * Component for entering the last name of a child in an enrollment.
 */
export const LastNameField: React.FC<ChildInfoFormFieldProps> = ({ error, errorAlertState }) => {
	return (
		<FormField<Enrollment, TextInputProps, string | null>
			getValue={(data) => data.at('child').at('lastName')}
			defaultValue=""
			parseOnChangeEvent={(e) => e.target.value}
			inputComponent={TextInput}
			type="input"
			id="lastName"
			label="Last name"
			status={(_) =>
				displayValidationStatus([
					{
						type: 'error',
						field: 'child.lastname',
						response: error || null,
						message: REQUIRED_FOR_ENROLLMENT,
						errorAlertState,
					},
				])
			}
		/>
	);
};
