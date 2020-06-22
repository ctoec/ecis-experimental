import React from 'react';
import { TextInputProps, TextInput } from '../../../../../../components';
import FormField from '../../../../../../components/Form_New/FormField';
import { Enrollment } from '../../../../../../generated';
import { displayValidationStatus } from '../../../../../../utils/validations/displayValidationStatus';
import { REQUIRED_FOR_OEC_REPORTING } from '../../../../../../utils/validations/messageStrings';

type FamilyIdFieldProps = {
	defaultValue?: number;
};
export const FamilyIdField: React.FC<FamilyIdFieldProps> = ({ defaultValue }) => {
	return (
		<FormField<Enrollment, TextInputProps, number | null>
			defaultValue={defaultValue}
			getValue={(data) => data.at('child').at('c4KFamilyCaseNumber')}
			parseOnChangeEvent={(e) => parseInt(e.target.value, 10) || null}
			inputComponent={TextInput}
			label="Family ID"
			id="c4k-family-id"
			status={(data) =>
				displayValidationStatus([
					{
						type: 'warning',
						response: data.at('child').at('validationErrors').value || null,
						field: 'c4KFamilyCaseNumber',
						message: REQUIRED_FOR_OEC_REPORTING,
					},
				])
			}
		/>
	);
};