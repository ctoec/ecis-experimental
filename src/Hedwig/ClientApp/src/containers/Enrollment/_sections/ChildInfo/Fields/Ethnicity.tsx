import React from 'react';
import FormField from '../../../../../components/Form_New/FormField';
import { Enrollment } from '../../../../../generated';
import { initialLoadErrorGuard } from '../../../../../utils/validations';
import { displayValidationStatus } from '../../../../../utils/validations/displayValidationStatus';
import { REQUIRED_FOR_OEC_REPORTING } from '../../../../../utils/validations/messageStrings';
import { ChildInfoFormFieldProps } from './common';
import {
	RadioButtonGroupProps,
	RadioButtonGroup,
} from '../../../../../components/RadioButtonGroup/RadioButtonGroup';
import RadioButton from '../../../../../components/RadioButton/RadioButton';

/**
 * Component for entering the enthicity of a child in an enrollment.
 *
 * The internal controlling component, RadioButtonGroup, wraps the individual
 * RadioButtons in a fieldset.
 */
export const EthnicityField: React.FC<ChildInfoFormFieldProps> = ({ initialLoad }) => {
	return (
		<FormField<Enrollment, RadioButtonGroupProps, boolean | null>
			getValue={(data) => data.at('child').at('hispanicOrLatinxEthnicity')}
			preprocessForDisplay={(data) =>
				data == undefined // check for both null and undefined
					? undefined
					: data
					? 'yes'
					: 'no'
			}
			parseOnChangeEvent={(e) => e.target.value === 'yes'}
			inputComponent={RadioButtonGroup}
			id="ethnicity-radiogroup"
			legend="Ethnicity"
			hint="As identified by family"
			options={[
				{
					render: (props) => <RadioButton text="Not Hispanic or Latinx" {...props} />,
					value: 'no',
				},
				{
					render: (props) => <RadioButton text="Hispanic or Latinx" {...props} />,
					value: 'yes',
				},
			]}
			status={(enrollment) =>
				initialLoadErrorGuard(
					initialLoad || false,
					displayValidationStatus([
						{
							type: 'warning',
							response: enrollment.at('child').at('validationErrors').value || null,
							field: 'hispanicOrLatinxEthnicity',
							message: REQUIRED_FOR_OEC_REPORTING,
						},
					])
				)
			}
		/>
	);
};
