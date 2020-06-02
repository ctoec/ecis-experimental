import React from 'react';
import FormField from '../../../../../components/Form_New/FormField';
import { Enrollment } from '../../../../../generated';
import { initialLoadErrorGuard } from '../../../../../utils/validations';
import { displayValidationStatus } from '../../../../../utils/validations/displayValidationStatus';
import { REQUIRED_FOR_OEC_REPORTING } from '../../../../../utils/validations/messageStrings';
import { ChildInfoFormFieldProps } from './common';
import RadioButton, { RadioButtonProps } from '../../../../../components/RadioButton/RadioButton';
import { FormFieldSet } from '../../../../../components/Form_New/FormFieldSet';
import FormContext, { useGenericContext } from '../../../../../components/Form_New/FormContext';
import { RadioButtonGroup } from '../../../../../components/RadioButtonGroup_NEW/RadioButtonGroup';

/**
 * Component for entering the enthicity of a child in an enrollment.
 *
 * The internal controlling component, RadioButtonGroup, wraps the individual
 * RadioButtons in a fieldset.
 */
export const EthnicityField: React.FC<ChildInfoFormFieldProps> = ({ initialLoad }) => {
	const { dataDriller } = useGenericContext<Enrollment>(FormContext);
	const hispanicOrLatinxEthnicity = dataDriller.at('child').at('hispanicOrLatinxEthnicity').value;

	return (
		<FormFieldSet<Enrollment>
			id="ethnicity"
			legend="Ethnicity"
			showLegend
			hint="As identified by family"
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
				)}
		>
			<RadioButtonGroup
				name="ethnicity-radiogroup"
				id="ethnicity-radiogroup"
				defaultValue={
					hispanicOrLatinxEthnicity == undefined 
						? hispanicOrLatinxEthnicity
						: hispanicOrLatinxEthnicity ? 'yes' : 'no'
				}
				options={[
					{
						render: (props) => (
							<FormField<Enrollment, RadioButtonProps, boolean | null>
								getValue={(data) => data.at('child').at('hispanicOrLatinxEthnicity')}
								parseOnChangeEvent={(e) =>  e.target.value === 'yes'}
								inputComponent={RadioButton}
								text="No"
								{...props}
							/>
						),
						value: 'no',
					},
					{
						render: (props) => (
							<FormField<Enrollment, RadioButtonProps, boolean | null>
								getValue={(data) => data.at('child').at('hispanicOrLatinxEthnicity')}
								parseOnChangeEvent={(e) => e.target.value === 'yes'}
								inputComponent={RadioButton}
								text="Yes"
								{...props}
							/>
						),
						value: 'yes',
					},
				]}
			>
			</RadioButtonGroup>
		</FormFieldSet>
	) 
};
