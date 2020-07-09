import React from 'react';
import FormField from '../../../../../components/Form_New/FormField';
import { Enrollment } from '../../../../../generated';
import { DateInput, DateInputProps } from '../../../../../components';
import { ChildInfoFormFieldProps } from './common';
import { errorDisplayGuard } from '../../../../../utils/validations';
import { displayValidationStatus } from '../../../../../utils/validations/displayValidationStatus';
import { REQUIRED_FOR_OEC_REPORTING } from '../../../../../utils/validations/messageStrings';
import { parseDateChange } from '../../../../../components/Form_New';

/**
 * Component for entering the birth date of a child in an enrollment.
 */
export const DateOfBirthField: React.FC<ChildInfoFormFieldProps> = ({
	blockErrorDisplay = false,
}) => {
	return (
		<FormField<Enrollment, DateInputProps, Date | null>
			getValue={(data) => data.at('child').at('birthdate')}
			parseOnChangeEvent={parseDateChange}
			inputComponent={DateInput}
			id="birthdate-picker"
			label="Birth date"
			status={(enrollment) =>
				errorDisplayGuard(
					blockErrorDisplay,
					displayValidationStatus([
						{
							type: 'warning',
							response: enrollment.at('child').at('validationErrors').value || null,
							fields: ['birthdate'],
							message: REQUIRED_FOR_OEC_REPORTING,
						},
					])
				)
			}
		/>
	);
};
