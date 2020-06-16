import React from 'react';
import FormField from '../../../../../components/Form_New/FormField';
import { Enrollment } from '../../../../../generated';
import { DateInput, DateInputProps } from '../../../../../components';
import { ChildInfoFormFieldProps } from './common';
import { initialLoadErrorGuard } from '../../../../../utils/validations';
import { displayValidationStatus } from '../../../../../utils/validations/displayValidationStatus';
import { REQUIRED_FOR_OEC_REPORTING } from '../../../../../utils/validations/messageStrings';

/**
 * Component for entering the birth date of a child in an enrollment.
 */
export const DateOfBirthField: React.FC<ChildInfoFormFieldProps> = ({ errorDisplayGuard: initialLoad }) => {
	return (
		<FormField<Enrollment, DateInputProps, Date | null>
			getValue={(data) => data.at('child').at('birthdate')}
			parseOnChangeEvent={(e) => (e.target.value ? new Date(parseInt(e.target.value, 10)) : null)}
			inputComponent={DateInput}
			id="birthdate-picker"
			label="Birth date"
			hideLabel
			status={(enrollment) =>
				initialLoadErrorGuard(
					initialLoad || false,
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
