import React from 'react';
import { fosterText } from '../../../../../utils/models';
import { Enrollment } from '../../../../../generated';
import { FamilyInfoFormFieldProps } from './common';
import { Checkbox, CheckboxProps } from '../../../../../components';
import FormField from '../../../../../components/Form_New/FormField';

export const FosterCheckbox: React.FC<FamilyInfoFormFieldProps> = () => (
	<FormField<Enrollment, CheckboxProps, boolean | null>
		getValue={(data) => data.at('child').at('foster')}
		value={'foster'}
		parseOnChangeEvent={(e) => e.target.checked}
		inputComponent={Checkbox}
		id="foster"
		text={fosterText()}
		className="margin-top-3"
	/>
);
