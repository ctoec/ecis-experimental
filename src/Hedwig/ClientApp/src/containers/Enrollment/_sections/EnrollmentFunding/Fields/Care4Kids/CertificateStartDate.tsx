import React from 'react';
import { Enrollment } from '../../../../../../generated';
import { DateInputProps, DateInput } from '../../../../../../components';
import { C4kCertificateFormFieldProps } from '../common';
import { displayValidationStatus } from '../../../../../../utils/validations/displayValidationStatus';
import { errorDisplayGuard } from '../../../../../../utils/validations';
import { FormField, parseDateChange } from '@ctoec/component-library';

export const CertificateStartDate: React.FC<C4kCertificateFormFieldProps> = ({
	certificateId,
	blockErrorDisplay = false,
}) => {
	return (
		<FormField<Enrollment, DateInputProps, Date | null>
			getValue={(data) => {
				return data
					.at('child')
					.at('c4KCertificates')
					.find((c) => c.id === certificateId)
					.at('startDate');
			}}
			parseOnChangeEvent={(e) => {
				return parseDateChange(e);
			}}
			inputComponent={DateInput}
			label="Start date"
			id={`c4k-${certificateId}-start-date`}
			status={(data) =>
				errorDisplayGuard(
					blockErrorDisplay,
					displayValidationStatus([
						{
							type: 'warning',
							response:
								data
									.at('child')
									.at('c4KCertificates')
									.find((c) => c.id === certificateId)
									.at('validationErrors').value || null,
							field: 'startDate',
							useValidationErrorMessage: true,
						},
					])
				)
			}
		/>
	);
};
