import React from 'react';
import FormField from '../../../../../components/Form_New/FormField';
import { Enrollment, Gender } from '../../../../../generated';
import { errorDisplayGuard } from '../../../../../utils/validations';
import { displayValidationStatus } from '../../../../../utils/validations/displayValidationStatus';
import { REQUIRED_FOR_OEC_REPORTING } from '../../../../../utils/validations/messageStrings';
import { ChildInfoFormFieldProps } from './common';
import { genderFromString, prettyGender } from '../../../../../utils/models';
import { SelectProps, Select } from '../../../../../components/Select/Select';

/**
 * Component for entering the gender of a child in an enrollment.
 */
export const GenderField: React.FC<ChildInfoFormFieldProps> = ({
	blockErrorDisplay = false,
}) => {
	return (
		<FormField<Enrollment, SelectProps, Gender>
			getValue={(data) => data.at('child').at('gender')}
			// Gender will always be defined, so the cast will always succeed
			preprocessForDisplay={(data) => prettyGender(data as Gender)}
			parseOnChangeEvent={(e) => genderFromString(e.target.value)}
			inputComponent={Select}
			id="gender-select"
			label="Gender"
			hint="As identified by family"
			options={[
				{
					value: prettyGender(Gender.Female),
					text: 'Female',
				},
				{
					value: prettyGender(Gender.Male),
					text: 'Male',
				},
				{
					value: prettyGender(Gender.Nonbinary),
					text: 'Nonbinary',
				},
				{
					value: prettyGender(Gender.Unknown),
					text: 'Unknown',
				},
			]}
			status={(enrollment) =>
				errorDisplayGuard(
					blockErrorDisplay,
					displayValidationStatus([
						{
							type: 'warning',
							response: enrollment.at('child').at('validationErrors').value || null,
							field: 'gender',
							message: REQUIRED_FOR_OEC_REPORTING,
						},
					])
				)
			}
		/>
	);
};
