import React from 'react';
import FormField from '../../../../../components/Form_New/FormField';
import { Enrollment } from '../../../../../generated';
import { TextInputProps, TextInput } from '../../../../../components';
import { ChildInfoFormFieldProps } from './common';
import { initialLoadErrorGuard } from '../../../../../utils/validations';
import { displayValidationStatus } from '../../../../../utils/validations/displayValidationStatus';

/**
 * Component for entering a birth certificate id of a child in an enrollment.
 */
export const BirthCertificateIdField: React.FC<ChildInfoFormFieldProps> = ({
	errorDisplayGuard: initialLoad,
}) => {
	return (
		<FormField<Enrollment, TextInputProps, string | null>
			getValue={(data) => data.at('child').at('birthCertificateId')}
			parseOnChangeEvent={(e) => e.target.value}
			inputComponent={TextInput}
			type="input"
			id="birthCertificateId"
			label="Birth certificate ID #"
			status={(enrollment) =>
				initialLoadErrorGuard(
					initialLoad || false,
					displayValidationStatus([
						{
							type: 'warning',
							response: enrollment.at('child').at('validationErrors').value || null,
							field: 'birthCertificateId',
						},
					])
				)
			}
		/>
	);
};
