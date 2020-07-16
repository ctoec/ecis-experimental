import React from 'react';
import { Enrollment } from '../../../../../generated';
import { TextInputProps, TextInput, FormField } from '@ctoec/component-library';
import { ChildInfoFormFieldProps } from './common';
import { errorDisplayGuard } from '../../../../../utils/validations';
import { displayValidationStatus } from '../../../../../utils/validations/displayValidationStatus';

/**
 * Component for entering a birth certificate id of a child in an enrollment.
 */
export const BirthCertificateIdField: React.FC<ChildInfoFormFieldProps> = ({
	blockErrorDisplay = false,
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
				errorDisplayGuard(
					blockErrorDisplay,
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
