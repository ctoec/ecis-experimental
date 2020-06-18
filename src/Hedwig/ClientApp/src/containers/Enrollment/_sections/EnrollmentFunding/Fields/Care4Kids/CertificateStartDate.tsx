import React from 'react';
import FormField from '../../../../../../components/Form_New/FormField';
import { Enrollment } from '../../../../../../generated';
import { DateInputProps, DateInput } from '../../../../../../components';
import { C4kCertificateFormFieldProps } from '../common';
import { displayValidationStatus } from '../../../../../../utils/validations/displayValidationStatus';
import { REQUIRED_FOR_OEC_REPORTING } from '../../../../../../utils/validations/messageStrings';
import { parseDateChange } from '../../../../../../components/Form_New';
import moment from 'moment';

export const CertificateStartDate: React.FC<C4kCertificateFormFieldProps> = ({ certificateId }) => {
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
						message: REQUIRED_FOR_OEC_REPORTING,
					},
				])
			}
		/>
	);
};
