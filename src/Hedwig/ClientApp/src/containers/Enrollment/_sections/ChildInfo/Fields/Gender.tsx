import React from 'react';
import FormField from '../../../../../components/Form_New/FormField';
import { Enrollment, Gender } from '../../../../../generated';
import { initialLoadErrorGuard } from '../../../../../utils/validations';
import { displayValidationStatus } from '../../../../../utils/validations/displayValidationStatus';
import { REQUIRED_FOR_OEC_REPORTING } from '../../../../../utils/validations/messageStrings';
import { ChildInfoFormFieldProps } from './common';
import { genderFromString, prettyGender } from '../../../../../utils/models';
import { SelectProps, Select } from '../../../../../components/Select/Select';

/**
 * Component for entering the gender of a child in an enrollment.
 */
export const GenderField: React.FC<ChildInfoFormFieldProps> = ({ initialLoad }) => {
	return (
		<FormField<Enrollment, SelectProps, Gender | null>
			getValue={(data) => data.at('child').at('gender')}
			// The preprocessForDisplay prop handles the defaultValue
			preprocessForDisplay={(data) => prettyGender(data || Gender.Unspecified)}
			parseOnChangeEvent={(e) => genderFromString(e.target.value)}
			inputComponent={Select}
			id="gender-select"
			label="Gender"
			hint="As identified by family"
			options={[
				{
					value: Gender.Female,
					text: 'Female',
				},
				{
					value: Gender.Male,
					text: 'Male',
				},
				{
					value: Gender.Nonbinary,
					text: 'Nonbinary',
				},
				{
					value: Gender.Unknown,
					text: 'Unknown',
				},
			]}
			status={(enrollment) =>
				initialLoadErrorGuard(
					initialLoad || false,
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
