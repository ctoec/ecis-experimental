import { FamilyInfoFormFieldProps } from './common';
import { TextInput } from '../../../../../components';
import React from 'react';
import { initialLoadErrorGuard } from '../../../../../utils/validations';
import { displayValidationStatus } from '../../../../../utils/validations/displayValidationStatus';
import idx from 'idx';

export const Town: React.FC<FamilyInfoFormFieldProps> = ({ initialLoad }) => (
	<TextInput
		type="input"
		id="town"
		label="Town"
		name="child.family.town"
		defaultValue={town || ''}
		onChange={updateFormData()}
		status={initialLoadErrorGuard(
			initialLoad,
			displayValidationStatus([
				{
					type: 'warning',
					response: idx(child, (_) => _.family.validationErrors) || null,
					field: 'town',
				},
			])
		)}
	/>
);
