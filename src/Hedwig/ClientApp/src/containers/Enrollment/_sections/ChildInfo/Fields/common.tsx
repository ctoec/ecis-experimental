import React from 'react';
import { ErrorAlertState } from '../../../../../hooks/useCatchallErrorAlert';
import {
	ValidationResponse,
	displayValidationStatus,
} from '../../../../../utils/validations/displayValidationStatus';
import { TObjectDriller } from '../../../../../components/Form_New/ObjectDriller';
import { Enrollment } from '../../../../../generated';
import FormField from '../../../../../components/Form_New/FormField';
import { TextInputProps, TextInput } from '../../../../../components';
import { initialLoadErrorGuard } from '../../../../../utils/validations';
import { REQUIRED_FOR_ENROLLMENT } from '../../../../../utils/validations/messageStrings';

// Common helper type for supplying additional props to field components
export type ChildInfoFormFieldProps = {
	initialLoad?: boolean;
	error?: ValidationResponse | null;
	errorAlertState?: ErrorAlertState;
};

type TextInputFormFactoryOptions = {
	id: string;
	label: string;
	accessor: (data: TObjectDriller<Enrollment>) => TObjectDriller<string | null>;
	field: string;
	optional?: boolean;
	withNonBlockingValidationErrors?: boolean;
	withBlockingValidationErrors?: boolean;
};

export function textInputFieldFactory<T extends ChildInfoFormFieldProps>({
	id,
	label,
	field,
	accessor,
	optional,
	withBlockingValidationErrors,
	withNonBlockingValidationErrors,
}: TextInputFormFactoryOptions): React.FC<T> {
	return ({ initialLoad, error, errorAlertState }: T) => {
		const errorStatus = withBlockingValidationErrors
			? () =>
					initialLoadErrorGuard(
						initialLoad || false,
						displayValidationStatus([
							{
								type: 'error',
								field: field,
								response: error || null,
								message: REQUIRED_FOR_ENROLLMENT,
								errorAlertState,
							},
						])
					)
			: () => undefined;
		const warningStatus = withNonBlockingValidationErrors
			? (enrollment: TObjectDriller<Enrollment>) =>
					initialLoadErrorGuard(
						initialLoad || false,
						displayValidationStatus([
							{
								type: 'warning',
								response: enrollment.at('child').at('validationErrors').value || null,
								field: field,
							},
						])
					)
			: () => undefined;
		return (
			<FormField<Enrollment, TextInputProps, string | null>
				getValue={accessor}
				defaultValue=""
				parseOnChangeEvent={(e) => e.target.value}
				inputComponent={TextInput}
				type="input"
				id={id}
				label={label}
				status={(enrollment) => errorStatus() || warningStatus(enrollment)}
				optional={optional}
			/>
		);
	};
}
