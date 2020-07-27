import React from 'react';
import { FormField } from '@ctoec/component-library';
import { homelessnessText } from '../../../../../utils/models';
import { Enrollment } from '../../../../../generated';
import { FamilyInfoFormFieldProps } from './common';
import { CheckboxProps, Checkbox } from '../../../../../components';

export const HomelessnessCheckbox: React.FC<FamilyInfoFormFieldProps> = () => (
	<div className="margin-top-3">
		<FormField<Enrollment, CheckboxProps, boolean | null>
			id="homelessness"
			getValue={(data) => data.at('child').at('family').at('homelessness')}
			parseOnChangeEvent={(e) => e.target.checked}
			inputComponent={Checkbox}
			text={homelessnessText()}
			value={'homelessness'}
		/>
		<p className="usa-hint text-italic">
			Indicate if you are aware that the family has experienced housing insecurity, including
			overcrowded housing, within the last year.
		</p>
	</div>
);
