import React from 'react';
import { Enrollment } from '../../../generated';
import { ApiError } from '../../../hooks/useApi';
import { REQUIRED_FOR_WITHDRAWAL } from '../../../utils/validations/messageStrings';
import { displayValidationStatus } from '../../../utils/validations/displayValidationStatus';
import { enrollmentExitReasons } from '../../../utils/models';
import { FormField } from '../../../components/Form_New';
import { SelectProps, Select } from '../../../components/Select/Select';
import { ErrorAlertState } from '../../../hooks/useCatchallErrorAlert';

type ExitReasonFieldProps = {
	errorAlertState?: ErrorAlertState;
	error: ApiError | null;
};
/**
 * This component is used in Withdrawal to update the exit reason field on
 * enrollment.
 */
export const ExitReasonField: React.FC<ExitReasonFieldProps> = ({ errorAlertState, error }) => {
	return (
		<FormField<Enrollment, SelectProps, string | null>
			getValue={(data) => data.at('exitReason')}
			parseOnChangeEvent={(e) => e.target.value}
			inputComponent={Select}
			id="exit-reason"
			label="Reason"
			options={Object.entries(enrollmentExitReasons).map(([key, reason]) => ({
				value: key,
				text: reason,
			}))}
			status={(_) =>
				displayValidationStatus([
					{
						type: 'error',
						response: error,
						field: 'exitReason',
						message: REQUIRED_FOR_WITHDRAWAL,
						errorAlertState,
					},
				])
			}
		/>
	);
};
