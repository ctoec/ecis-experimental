import { FamilyInfoFormFieldProps } from './common';
import { TextInput } from '../../../../../components';
import React from 'react';
import { initialLoadErrorGuard } from '../../../../../utils/validations';
import { displayValidationStatus } from '../../../../../utils/validations/displayValidationStatus';
import idx from 'idx';

export const AddressLine1: React.FC<FamilyInfoFormFieldProps> = ({ initialLoad }) => (
	<TextInput
		type="input"
		id="addressLine1"
		label="Address line 1"
		name="child.family.addressLine1"
		defaultValue={addressLine1 || ''}
		onChange={updateFormData()}
		status={initialLoadErrorGuard(
			initialLoad,
			displayValidationStatus([
				{
					type: 'warning',
					response: idx(child, (_) => _.family.validationErrors) || null,
					field: 'addressline1',
				},
			])
		)}
	/>
);
