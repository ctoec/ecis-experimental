import React from 'react';
import { Enrollment } from '../../../../../../generated';
import { Form, FormSubmitButton } from '../../../../../../components/Form_New';
import { EnrollmentStartDateField } from '../../Fields/EnrollmentStartDate';
import { AgeGroupField } from '../../Fields/AgeGroup';
import { Button } from '../../../../../../components';
import { ExpandCard } from '../../../../../../components/Card/ExpandCard';
import { ErrorAlertState } from '../../../../../../hooks/useCatchAllErrorAlert';
import { ApiError } from '../../../../../../hooks/useApi';

type EnrollmentFormForCardProps = {
	formData: Enrollment;
	onSubmit: (_: Enrollment) => void;
	error: ApiError | null;
	errorAlertState: ErrorAlertState;
};

/**
 * The single-enrollment form to be embedded in EnrollmentCard in the UpdateForm.
 *
 * This form only handles editing the existing current enrollment.
 * Past enrollments cannot be edited at this time, a limitation of
 * returning them as un-mapped `pastEnrollments` on the current enrollment entity.
 * New enrollments are created with a different form that also gives funding options.
 */
export const EnrollmentFormForCard: React.FC<EnrollmentFormForCardProps> = ({
	formData,
	onSubmit,
	error,
	errorAlertState,
}) => {
	return (
		<Form id={`edit-enrollment`} data={formData} onSubmit={onSubmit} className="usa-form">
			<EnrollmentStartDateField
				blockErrorDisplay={false}
				error={error}
				errorAlertState={errorAlertState}
			/>
			<AgeGroupField blockErrorDisplay={false} error={error} errorAlertState={errorAlertState} />
			<ExpandCard>
				<Button text="Cancel" appearance="outline" />
			</ExpandCard>
			<FormSubmitButton text="Save edits" />
		</Form>
	);
};
