import React from 'react';
import { TextInputProps, TextInput } from '../../../../../../components';
import FormField from '../../../../../../components/Form_New/FormField';
import { Enrollment } from '../../../../../../generated';

export const FamilyIdField: React.FC = () => {
	return (
		<FormField<Enrollment, TextInputProps, number | null>
			getValue={(data) => data.at('child').at('c4KFamilyCaseNumber')}
			parseOnChangeEvent={(e) => parseInt(e.target.value, 10) || null}
			inputComponent={TextInput}
			label="Family ID"
			id="c4k-family-id"
			status={undefined} // TODO
		/>
	)
}
