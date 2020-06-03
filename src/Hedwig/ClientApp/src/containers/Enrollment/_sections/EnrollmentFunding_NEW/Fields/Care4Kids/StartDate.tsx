import React from 'react';
import FormField from '../../../../../../components/Form_New/FormField';
import { Enrollment } from '../../../../../../generated';
import { DateInputProps, DateInput } from '../../../../../../components';
import { C4kCertificateFormFieldProps } from '../common';


export const StartDateField: React.FC<C4kCertificateFormFieldProps> = ({ certificateId }) => {
	return (
		<FormField<Enrollment, DateInputProps, Date | null>
			getValue={data =>
				data
					.at('child')
					.at('c4KCertificates')
					.find(c => c.id === certificateId)
					.at('startDate')
			}
			parseOnChangeEvent={e => e.target.value ? new Date(parseInt(e.target.value)) : null}
			inputComponent={DateInput}
			label="Start date"
			id={`c4k-${certificateId}-start-date`}
			status={undefined} // TODO
		/>
	)
}
