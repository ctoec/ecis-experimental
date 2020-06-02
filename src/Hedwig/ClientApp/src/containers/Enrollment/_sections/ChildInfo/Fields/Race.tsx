import React from 'react';
import FormField from '../../../../../components/Form_New/FormField';
import { Enrollment } from '../../../../../generated';
import { initialLoadErrorGuard } from '../../../../../utils/validations';
import { displayValidationStatus } from '../../../../../utils/validations/displayValidationStatus';
import { REQUIRED_FOR_OEC_REPORTING } from '../../../../../utils/validations/messageStrings';
import { ChildInfoFormFieldProps } from './common';
import {
	CheckboxGroupForForm,
	CheckboxOption,
} from '../../../../../components/CheckboxGroup/CheckboxGroup';
import Checkbox, { CheckboxProps } from '../../../../../components/Checkbox/Checkbox';
import { CheckboxGroup } from '../../../../../components/CheckboxGroup_NEW/CheckboxGroup';
import { FormFieldSet } from '../../../../../components/Form_New/FormFieldSet';
import { select } from '@storybook/addon-knobs';

/**
 * Helper type of all valid race properties on Child
 */
type RaceField =
	| 'americanIndianOrAlaskaNative'
	| 'asian'
	| 'blackOrAfricanAmerican'
	| 'nativeHawaiianOrPacificIslander'
	| 'white';

/**
 *
 * @param label The text for the Checkbox to display
 * @param field The property name on Child of the race
 */
const raceOptionFactory: (label: string, field: RaceField) => CheckboxOption = (label, field) => ({
	render: ({ id, selected }) => (
		<FormField<Enrollment, CheckboxProps, boolean>
			getValue={(data) => data.at('child').at(field)}
			parseOnChangeEvent={(e) => e.target.checked}
			defaultValue={selected}
			inputComponent={Checkbox}
			id={id}
			text={label}
		/>
	),
	value: field,
});


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

	return (
		<FormFieldSet<Enrollment>
			id="race"
			legend="Race"
			showLegend
			legendStyle="title"
		>
			<CheckboxGroup
				id="race-checkboxgroup"
				options={[
					{
						render: ({selected}) => <FormField<Enrollment, CheckboxProps, boolean>
							getValue={data => data.at('child').at('americanIndianOrAlaskaNative')}
							parseOnChangeEvent={(e) => e.target.checked}
							defaultValue={selected}
							inputComponent={Checkbox}
							id={'american-indian-or-alaska-native-checkbox'}
							text='American Indian or Alaska Native'
						/>,
						value: 'americanIndianOrAlaskaNative'
					}
				]}
			/>
		</FormFieldSet>

	)
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
				raceOptionFactory('American Indian or Alaska Native', 'americanIndianOrAlaskaNative'),
				raceOptionFactory('Asian', 'asian'),
				raceOptionFactory('Black or African American', 'blackOrAfricanAmerican'),
				raceOptionFactory('Native Hawaiian or Pacific Islander', 'nativeHawaiianOrPacificIslander'),
				raceOptionFactory('White', 'white'),
			]}
			status={(enrollment) =>
				initialLoadErrorGuard(
					initialLoad || false,
					displayValidationStatus([
						{
							type: 'warning',
							response: enrollment.at('child').at('validationErrors').value || null,
							fields: [
								'americanIndianOrAlaskaNative',
								'asian',
								'blackOrAfricanAmerican',
								'nativeHawaiianOrPacificIslander',
								'white',
							],
							message: REQUIRED_FOR_OEC_REPORTING,
						},
					])
				)
			}
		/>
	);
};
