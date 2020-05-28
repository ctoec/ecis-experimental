import React from 'react';
import FormField from '../../../../../components/Form_New/FormField';
import { Enrollment } from '../../../../../generated';
import { TextInputProps, TextInput } from '../../../../../components';
import { ChildInfoFormFieldProps } from './common';
import { initialLoadErrorGuard } from '../../../../../utils/validations';
import { displayValidationStatus } from '../../../../../utils/validations/displayValidationStatus';
import { REQUIRED_FOR_ENROLLMENT } from '../../../../../utils/validations/messageStrings';

/**
 * Component for entering the last name of a child in an enrollment.
 */
export const LastNameField: React.FC<ChildInfoFormFieldProps> = ({
	initialLoad,
	error,
	errorAlertState,
}) => {
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
				initialLoadErrorGuard(
					initialLoad || false,
					displayValidationStatus([
						{
							type: 'error',
							field: 'child.lastname',
							response: error || null,
							message: REQUIRED_FOR_ENROLLMENT,
							errorAlertState,
						},
					])
				)
			}
		/>
	);
};
