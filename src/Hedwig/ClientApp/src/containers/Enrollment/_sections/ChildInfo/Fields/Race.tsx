import React from 'react';
import FormField from '../../../../../components/Form_New/FormField';
import { Enrollment } from '../../../../../generated';
import { initialLoadErrorGuard } from '../../../../../utils/validations';
import { displayValidationStatus } from '../../../../../utils/validations/displayValidationStatus';
import { REQUIRED_FOR_OEC_REPORTING } from '../../../../../utils/validations/messageStrings';
import { ChildInfoFormFieldProps } from './common';
import Checkbox, { CheckboxProps  } from '../../../../../components/Checkbox/Checkbox';
import { CheckboxGroup, CheckboxOption } from '../../../../../components/CheckboxGroup_NEW/CheckboxGroup';
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
	render: ({ selected }) => (
		<FormField<Enrollment, CheckboxProps, boolean>
			getValue={(data) => data.at('child').at(field)}
			parseOnChangeEvent={(e) => e.target.checked}
			defaultValue={selected}
			inputComponent={Checkbox}
			id={`race-${field}-checkbox`}
			text={label}
		/>
	),
	value: field,
});


/**
 * Component for entering the race of a child in an enrollment.
 */

export const RaceField: React.FC<ChildInfoFormFieldProps> = ({ initialLoad }) => {

	return (
		<FormFieldSet<Enrollment>
			id="race"
			legend="Race"
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
		>
			<CheckboxGroup
				id="race-checkboxgroup"
				options={[
					raceOptionFactory('American Indian or Alaska Native', 'americanIndianOrAlaskaNative'),
					raceOptionFactory('Asian', 'asian'),
					raceOptionFactory('Black or African American', 'blackOrAfricanAmerican'),
					raceOptionFactory('Native Hawaiian or Pacific Islander', 'nativeHawaiianOrPacificIslander'),
					raceOptionFactory('White', 'white'),
				]}
			/>
		</FormFieldSet>
	);
};
