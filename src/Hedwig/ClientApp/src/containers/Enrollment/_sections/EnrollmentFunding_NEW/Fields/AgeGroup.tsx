import React from 'react';
import { RadioButtonGroupProps, RadioButtonGroup } from "../../../../../components/RadioButtonGroup/RadioButtonGroup"
import { Age, Enrollment } from '../../../../../generated';
import FormField from '../../../../../components/Form_New/FormField';
import { ageFromString, prettyAge } from '../../../../../utils/models';
import RadioButton from '../../../../../components/RadioButton/RadioButton';
import { initialLoadErrorGuard } from '../../../../../utils/validations';
import { displayValidationStatus } from '../../../../../utils/validations/displayValidationStatus';
import { REQUIRED_FOR_OEC_REPORTING } from '../../../../../utils/validations/messageStrings';

export const AgeGroupField: React.FC<{initialLoad: boolean}> = ({ initialLoad }) => {
	return (
		<FormField<Enrollment, RadioButtonGroupProps, Age | null>
			getValue={data => data.at('ageGroup')}
			parseOnChangeEvent={e => ageFromString((e.target as HTMLInputElement).value)}
			inputComponent={RadioButtonGroup}
			id="age-group-radiogroup"
			legend="Age group"
			showLegend
			legendStyle="title"
			options={[
				{
					render: (props) => <RadioButton text={prettyAge(Age.InfantToddler)} {...props} />,
					value: Age.InfantToddler,
				},
				{
					render: (props) => <RadioButton text={prettyAge(Age.Preschool)} {...props} />,
					value: Age.Preschool,
				},
				{
					render: (props) => <RadioButton text={prettyAge(Age.SchoolAge)} {...props} />,
					value: Age.SchoolAge,
				}
			]}
			status={data => 
				initialLoadErrorGuard(
					initialLoad,
					displayValidationStatus([
						{
							type: 'warning',
							response: data.at('validationErrors').value,
							field: 'ageGroup',
							message: REQUIRED_FOR_OEC_REPORTING
						}
					])
				)
			}
		/>
	)
}
