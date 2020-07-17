import React from 'react';
import { fosterText } from '../../../../../utils/models';
import { Enrollment } from '../../../../../generated';
import { FamilyInfoFormFieldProps } from './common';
import { FormField } from '@ctoec/component-library';
import { Checkbox, CheckboxProps } from '../../../../../components';

export const FosterCheckbox: React.FC<FamilyInfoFormFieldProps> = () => (
	<FormField<Enrollment, CheckboxProps, boolean | null>
		getValue={(data) => data.at('child').at('foster')}
		parseOnChangeEvent={(e) => e.target.checked}
		inputComponent={Checkbox}
		id="foster"
		value={'foster'}
		text={fosterText()}
		className="margin-top-3"
	/>
);
