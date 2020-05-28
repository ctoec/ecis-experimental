import React from 'react';
import FormField from '../../../../../components/Form_New/FormField';
import { Enrollment } from '../../../../../generated';
import { initialLoadErrorGuard } from '../../../../../utils/validations';
import { displayValidationStatus } from '../../../../../utils/validations/displayValidationStatus';
import { REQUIRED_FOR_OEC_REPORTING } from '../../../../../utils/validations/messageStrings';
import { ChildInfoFormFieldProps } from './common';
import { CheckboxGroupForForm } from '../../../../../components/CheckboxGroup/CheckboxGroup';
import Checkbox, { CheckboxProps } from '../../../../../components/Checkbox/Checkbox';

/**
 * Component for entering the race of a child in an enrollment.
 */
// Each race option is individually stored on the child model. This prevents us
// from using one FormField component. The FormField component requires one path
// to the data in the supplied Form data object. Thus, we need to create FormFields
// for each race option. We want them to be Checkboxes, so the FormFields we create
// use the Checkbox component. We need all of these wrapped in a field set. We
// cannot use the FieldSet component because that requires status be an object. We
// need the FormFieldSet to allow us to supply a function for status. However, we
// cannot wrap the CheckboxGroup component in FormFieldSet because CheckboxGroup
// already wraps the Checkboxes in a FieldSet. So, we use a CheckboxGroupForForm
// component which wraps the Checkboxes in a FormFieldSet instead of FieldSet.
// TODO: Perhaps this is something to revisit so we don't need a separate component for
// use in a form.
export const RaceField: React.FC<ChildInfoFormFieldProps> = ({ initialLoad }) => {
	// We don't provide an onChange prop to CheckboxGroupForForm because the
	// individual Checkboxes manage their own changes. We also don't include the
	// onChange prop for each of the options because the FormField component creates
	// the onChange function and supplies it accordingly.
	return (
		<CheckboxGroupForForm<Enrollment>
			id="race-checkboxgroup"
			legend="Race"
			hint="As identified by family"
			options={[
				{
					render: ({ id, selected, value }) => (
						<FormField<Enrollment, CheckboxProps, boolean>
							getValue={(data) => data.at('child').at('americanIndianOrAlaskaNative')}
							parseOnChangeEvent={(e) => e.target.checked}
							defaultValue={selected}
							inputComponent={Checkbox}
							id={id}
							text="American Indian or Alaska Native"
							value={value}
						/>
					),
					value: 'americanIndianOrAlaskaNative',
				},
				{
					render: ({ id, selected, value }) => (
						<FormField<Enrollment, CheckboxProps, boolean>
							getValue={(data) => data.at('child').at('asian')}
							parseOnChangeEvent={(e) => e.target.checked}
							defaultValue={selected}
							inputComponent={Checkbox}
							id={id}
							text="Asian"
							value={value}
						/>
					),
					value: 'asian',
				},
				{
					render: ({ id, selected, value }) => (
						<FormField<Enrollment, CheckboxProps, boolean>
							getValue={(data) => data.at('child').at('blackOrAfricanAmerican')}
							parseOnChangeEvent={(e) => e.target.checked}
							defaultValue={selected}
							inputComponent={Checkbox}
							id={id}
							text="Black or African American"
							value={value}
						/>
					),
					value: 'blackOrAfricanAmerican',
				},
				{
					render: ({ id, selected, value }) => (
						<FormField<Enrollment, CheckboxProps, boolean>
							getValue={(data) => data.at('child').at('nativeHawaiianOrPacificIslander')}
							parseOnChangeEvent={(e) => e.target.checked}
							defaultValue={selected}
							inputComponent={Checkbox}
							id={id}
							text="Native Hawaiian or Pacific Islander"
							value={value}
						/>
					),
					value: 'nativeHawaiianOrPacificIslander',
				},
				{
					render: ({ id, selected, value }) => (
						<FormField<Enrollment, CheckboxProps, boolean>
							getValue={(data) => data.at('child').at('white')}
							parseOnChangeEvent={(e) => e.target.checked}
							defaultValue={selected}
							inputComponent={Checkbox}
							id={id}
							text="White"
							value={value}
						/>
					),
					value: 'white',
				},
			]}
			status={(enrollment) =>
				initialLoadErrorGuard(
					initialLoad || false,
					displayValidationStatus([
						{
							type: 'warning',
							response: enrollment.at('child').at('validationErrors').value || null,
							fields: ['americanIndianOrAlaskaNative'],
							message: REQUIRED_FOR_OEC_REPORTING,
						},
					])
				)
			}
		/>
	);
};
