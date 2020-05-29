import { FamilyInfoFormFieldProps } from './common';
import { TextInput } from '../../../../../components';
import React from 'react';
import { initialLoadErrorGuard } from '../../../../../utils/validations';
import { displayValidationStatus } from '../../../../../utils/validations/displayValidationStatus';
import idx from 'idx';

export const Zip: React.FC<FamilyInfoFormFieldProps> = ({ initialLoad }) => (
	<TextInput
		type="input"
		id="zip"
		label="ZIP Code"
		name="child.family.zip"
		defaultValue={zip || ''}
		onChange={updateFormData()}
		status={initialLoadErrorGuard(
			initialLoad,
			displayValidationStatus([
				{
					type: 'warning',
					response: idx(child, (_) => _.family.validationErrors) || null,
					field: 'zip',
				},
			])
		)}
	/>
);
