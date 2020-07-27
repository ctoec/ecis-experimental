import React, { useContext } from 'react';
import { Enrollment } from '../../../generated';
import produce from 'immer';
import set from 'lodash/set';
import { ApiError } from '../../../hooks/useApi';
import ReportingPeriodContext from '../../../contexts/ReportingPeriod/ReportingPeriodContext';
import {
	REQUIRED_FOR_WITHDRAWAL,
	REPORTING_PERIODS_ONLY_EXIST_FOR_FY2020_AND_BEYOND,
} from '../../../utils/validations/messageStrings';
import { displayValidationStatus } from '../../../utils/validations/displayValidationStatus';
import moment from 'moment';
import { lastNReportingPeriods } from '../../../utils/models';
import { ErrorAlertState } from '../../../hooks/useCatchAllErrorAlert';
import { DateInput } from '../../../components';
import { useGenericContext, FormContext } from '@ctoec/component-library';

type EnrollmentEndDateFieldProps = {
	attemptedSave: boolean;
	errorAlertState?: ErrorAlertState;
	error: ApiError | null;
};
/**
 * This component is used in Withdrawal to update the exit field on enrollment,
 * and certificateEndDate in C4K Certificates (if they exist).
 */
export const EnrollmentEndDateField: React.FC<EnrollmentEndDateFieldProps> = ({
	attemptedSave,
	errorAlertState,
	error,
}) => {
	const { dataDriller, updateData } = useGenericContext<Enrollment>(FormContext);
	const { cdcReportingPeriods } = useContext(ReportingPeriodContext);

	const currentEndDate = dataDriller.at('exit').value;
	const reportingPeriodOptions = lastNReportingPeriods(
		cdcReportingPeriods,
		currentEndDate || moment().toDate(),
		5
	);

	const hasC4kFunding = dataDriller.at('child').at('c4KCertificates').value.length > 0;

	return (
		<DateInput
			id="enrollment-end-date"
			label="Enrollment end date"
			onChange={(e) => {
				const target = e.target as HTMLInputElement;
				const endDate = moment(parseInt(target.value, 10)).toDate();
				// Update the enrollment exit field with the end date
				updateData((enrollment) =>
					produce<Enrollment>(enrollment, (draft) =>
						set(draft, dataDriller.at('exit').path, endDate)
					)
				);
				// Update the current c4kCertificate end date with the end date
				// Only if there are c4k certificate fundings
				if (hasC4kFunding) {
					updateData((enrollment) =>
						produce<Enrollment>(enrollment, (draft) =>
							set(
								draft,
								dataDriller
									.at('child')
									.at('c4KCertificates')
									.find((cert) => !cert.endDate)
									.at('endDate').path,
								endDate
							)
						)
					);
				}
			}}
			status={
				attemptedSave && !currentEndDate
					? {
							id: 'exit',
							type: 'error',
							message: REQUIRED_FOR_WITHDRAWAL,
					  }
					: reportingPeriodOptions.length === 0
					? {
							id: 'exit',
							type: 'error',
							message: REPORTING_PERIODS_ONLY_EXIST_FOR_FY2020_AND_BEYOND,
					  }
					: displayValidationStatus([
							{
								type: 'error',
								response: error,
								field: 'exit',
								useValidationErrorMessage: true,
								errorAlertState,
							},
					  ])
			}
		/>
	);
};
