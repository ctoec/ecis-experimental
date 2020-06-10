import React, { useEffect } from 'react';
import {
	RadioButtonGroupProps,
	RadioButtonGroup,
} from '../../../../../components/RadioButtonGroup/RadioButtonGroup';
import { Age, Enrollment } from '../../../../../generated';
import FormField from '../../../../../components/Form_New/FormField';
import { ageFromString, prettyAge } from '../../../../../utils/models';
import RadioButton from '../../../../../components/RadioButton/RadioButton';
import { initialLoadErrorGuard } from '../../../../../utils/validations';
import { displayValidationStatus } from '../../../../../utils/validations/displayValidationStatus';
import { REQUIRED_FOR_OEC_REPORTING } from '../../../../../utils/validations/messageStrings';
import FormContext, { useGenericContext } from '../../../../../components/Form_New/FormContext';
import produce from 'immer';
import set from 'lodash/set';

export const AgeGroupField: React.FC<{ initialLoad: boolean }> = ({ initialLoad }) => {
	const { data, dataDriller, updateData } = useGenericContext<Enrollment>(FormContext)

	return (
		<FormField<Enrollment, RadioButtonGroupProps, Age | null>
			getValue={(data) => data.at('ageGroup')}
			parseOnChangeEvent={(e) => {
				// Wipe out fundings when age group changes
				// since fundings must be associated with a funding space
				// and funding space agegroup must == enrollment age group
				setTimeout(() => updateData(
					produce<Enrollment>(data, (draft) =>
						set(
							draft,
							dataDriller.at('fundings').path,
							[]
						)
					)
				), 0);
				return ageFromString((e.target as HTMLInputElement).value)
			}}
			inputComponent={RadioButtonGroup}
			name="age-group"
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
				},
			]}
			status={(data) =>
				initialLoadErrorGuard(
					initialLoad,
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
