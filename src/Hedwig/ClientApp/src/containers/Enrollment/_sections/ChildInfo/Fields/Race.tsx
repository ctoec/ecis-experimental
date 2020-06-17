import React from 'react';
import FormField from '../../../../../components/Form_New/FormField';
import { Enrollment } from '../../../../../generated';
import { initialLoadErrorGuard } from '../../../../../utils/validations';
import { displayValidationStatus } from '../../../../../utils/validations/displayValidationStatus';
import { REQUIRED_FOR_OEC_REPORTING } from '../../../../../utils/validations/messageStrings';
import { ChildInfoFormFieldProps } from './common';
import {
	CheckboxOption,
	CheckboxGroup,
} from '../../../../../components/CheckboxGroup/CheckboxGroup';
import Checkbox, { CheckboxProps } from '../../../../../components/Checkbox/Checkbox';
import { FormFieldSetProps } from '../../../../../components/Form_New';

/**
 * Component for entering the race of a child in an enrollment.
 */
export const RaceField: React.FC<ChildInfoFormFieldProps> = ({
	errorDisplayGuard: initialLoad,
}) => {
	return (
		<CheckboxGroup<FormFieldSetProps<Enrollment>>
			useFormFieldSet
			legend="Race"
			id="race"
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
			options={[
				raceOptionFactory('American Indian or Alaska Native', 'americanIndianOrAlaskaNative'),
				raceOptionFactory('Asian', 'asian'),
				raceOptionFactory('Black or African American', 'blackOrAfricanAmerican'),
				raceOptionFactory('Native Hawaiian or Pacific Islander', 'nativeHawaiianOrPacificIslander'),
				raceOptionFactory('White', 'white'),
			]}
		/>
	);
};

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
