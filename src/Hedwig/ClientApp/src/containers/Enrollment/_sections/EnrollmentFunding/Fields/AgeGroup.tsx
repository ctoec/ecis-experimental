import React from 'react';
import {
	RadioButtonGroupProps,
	RadioButtonGroup,
	RadioButton,
} from '@ctoec/component-library';
import { Age, Enrollment } from '../../../../../generated';
import FormField from '../../../../../components/Form_New/FormField';
import { ageFromString, prettyAge } from '../../../../../utils/models';
import { errorDisplayGuard } from '../../../../../utils/validations';
import { displayValidationStatus } from '../../../../../utils/validations/displayValidationStatus';
import { REQUIRED_FOR_OEC_REPORTING } from '../../../../../utils/validations/messageStrings';
import FormContext, { useGenericContext } from '../../../../../components/Form_New/FormContext';
import produce from 'immer';
import set from 'lodash/set';
import { EnrollmentFormFieldProps } from './common';

/**
 * Component for setting the age group of an enrollment.
 * When the age group for an enrollment is changed, all
 * fundings are removed. Fundings must be associated with
 * a funding space, which must have a matching age group
 * to the funding's enrollment.
 */
export const AgeGroupField: React.FC<EnrollmentFormFieldProps> = ({
	blockErrorDisplay = false,
}) => {
	const { dataDriller, updateData } = useGenericContext<Enrollment>(FormContext);

	return (
		<FormField<Enrollment, RadioButtonGroupProps, Age | null>
			getValue={(data) => data.at('ageGroup')}
			parseOnChangeEvent={(e) => {
				// un-set all fundings on age group change
				setTimeout(
					() =>
						updateData((_data) =>
							produce<Enrollment>(_data, (draft) => set(draft, dataDriller.at('fundings').path, []))
						),
					0
				);
				return ageFromString((e.target as HTMLInputElement).value);
			}}
			inputComponent={RadioButtonGroup}
			name="age-group"
			id="age-group-radiogroup"
			legend="Age group"
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
				},
			]}
			status={(data) =>
				errorDisplayGuard(
					blockErrorDisplay,
					displayValidationStatus([
						{
							type: 'warning',
							response: data.at('validationErrors').value,
							field: 'ageGroup',
							message: REQUIRED_FOR_OEC_REPORTING,
						},
					])
				)
			}
		/>
	);
};
