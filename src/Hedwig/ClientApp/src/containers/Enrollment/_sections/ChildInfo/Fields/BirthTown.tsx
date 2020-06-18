import React from 'react';
import FormField from '../../../../../components/Form_New/FormField';
import { Enrollment } from '../../../../../generated';
import { TextInputProps, TextInput } from '../../../../../components';
import { ChildInfoFormFieldProps } from './common';
import { initialLoadErrorGuard } from '../../../../../utils/validations';
import { displayValidationStatus } from '../../../../../utils/validations/displayValidationStatus';

/**
 * Component for entering the birth town of a child in an enrollment.
 */
export const BirthTownField: React.FC<ChildInfoFormFieldProps> = ({
	errorDisplayGuard: initialLoad,
}) => {
	return (
		<FormField<Enrollment, TextInputProps, string | null>
			getValue={(data) => data.at('child').at('birthTown')}
			parseOnChangeEvent={(e) => e.target.value}
			inputComponent={TextInput}
			type="input"
			id="birthTown"
			label="Town"
			status={(enrollment) =>
				initialLoadErrorGuard(
					initialLoad || false,
					displayValidationStatus([
						{
							type: 'warning',
							response: enrollment.at('child').at('validationErrors').value || null,
							field: 'birthTown',
						},
					])
				)
			}
		/>
	);
};
