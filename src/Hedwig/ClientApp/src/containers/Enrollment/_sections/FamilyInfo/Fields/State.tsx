import { FamilyInfoFormFieldProps } from './common';
import { ChoiceList } from '../../../../../components';
import React from 'react';
import { initialLoadErrorGuard } from '../../../../../utils/validations';
import { displayValidationStatus } from '../../../../../utils/validations/displayValidationStatus';
import idx from 'idx';

export const State: React.FC<FamilyInfoFormFieldProps> = ({ initialLoad }) => (
	<ChoiceList
		type="select"
		id="state"
		label="State"
		name="child.family.state"
		options={['CT', 'MA', 'NY', 'RI'].map((_state) => ({ text: _state, value: _state }))}
		defaultValue={state ? [state] : undefined}
		onChange={updateFormData()}
		status={initialLoadErrorGuard(
			initialLoad,
			displayValidationStatus([
				{
					type: 'warning',
					response: idx(child, (_) => _.family.validationErrors) || null,
					field: 'state',
				},
			])
		)}
	/>
);
