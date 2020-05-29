import { FormFieldSet } from '../../../../../components/Form_New/FormFieldSet';
import React from 'react';
import { initialLoadErrorGuard } from '../../../../../utils/validations';
import { displayValidationStatus } from '../../../../../utils/validations/displayValidationStatus';
import idx from 'idx';
import { REQUIRED_FOR_ENROLLMENT } from '../../../../../utils/validations/messageStrings';
import { TextInput, ChoiceList } from '../../../../../components';

export const Address = ({
	initialLoad,
	child,
	addressLine1,
	updateFormData,
	town,
	addressLine2,
	state,
	zip,
}: any) => (
		<FormFieldSet
			id="family-address"
			legend="Address"
			// TODO: USE DATA DRILLER
			status={() =>
				initialLoadErrorGuard(
					initialLoad,
					displayValidationStatus([
						{
							type: 'warning',
							response: idx(child, (_) => _.family.validationErrors) || null,
							fields: ['addressline1', 'town', 'state', 'zip'],
							message: REQUIRED_FOR_ENROLLMENT,
						},
					])
				)
			}
			className="display-inline-block"
		>
			<div className="mobile-lg:grid-col-12">
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
			</div>
			<div className="mobile-lg:grid-col-12">
				<TextInput
					type="input"
					id="addressLine2"
					label="Address line 2"
					name="child.family.addressLine2"
					defaultValue={addressLine2 || ''}
					onChange={updateFormData()}
					optional={true}
				/>
			</div>
			<div className="mobile-lg:grid-col-8 display-inline-block">
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
			</div>
			<div className="mobile-lg:grid-col-4 display-inline-block">
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
			</div>
			<div className="mobile-lg:grid-col-6">
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
			</div>
		</FormFieldSet>
	);
