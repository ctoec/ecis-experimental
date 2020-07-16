import { C4kCertificateFormFieldProps } from '../common';
import React from 'react';
import { Enrollment } from '../../../../../../generated';
import { DateInputProps, DateInput } from '../../../../../../components';
import { displayValidationStatus } from '../../../../../../utils/validations/displayValidationStatus';
import { ApiError } from '../../../../../../hooks/useApi';
import { ErrorAlertState } from '../../../../../../hooks/useCatchAllErrorAlert';
import { FormField, parseDateChange } from '@ctoec/component-library';

type CertificateEndDateProps = C4kCertificateFormFieldProps & {
	error: ApiError | null;
	errorAlertState: ErrorAlertState;
};

export const CertificateEndDate: React.FC<CertificateEndDateProps> = ({
	certificateId,
	error,
	errorAlertState,
}) => {
	return (
		<FormField<Enrollment, DateInputProps, Date | null>
			getValue={(data) =>
				data
					.at('child')
					.at('c4KCertificates')
					.find((c) => c.id === certificateId)
					.at('endDate')
			}
			parseOnChangeEvent={parseDateChange}
			inputComponent={DateInput}
			label="End date"
			id={`c4k-${certificateId}-end-date`}
			status={(data) =>
				displayValidationStatus([
					{
						type: 'error',
						response: error,
						field: 'endDate',
						useValidationErrorMessage: true,
						errorAlertState,
					},
				])
			}
		/>
	);
};
