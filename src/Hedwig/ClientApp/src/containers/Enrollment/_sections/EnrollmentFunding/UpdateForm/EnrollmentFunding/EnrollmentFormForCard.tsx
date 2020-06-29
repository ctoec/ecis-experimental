import React from 'react';
import { Enrollment } from '../../../../../../generated';
import { Form, FormSubmitButton } from '../../../../../../components/Form_New';
import { EnrollmentStartDate } from '../../Fields/EnrollmentStartDate';
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

// For now, only edit AND only current enrollment
// (b/c other enrollments are displayed via "past enrollments",
// so they're not updateable thru the API)

/**
 * The single-enrollment form to be embedded in EnrollmentCard in the UpdateForm.
 *
 * This form only handles editing the existing current enrollment. Past enrollments
 * cannot be edited at this time given the limitation of returning them as
 * un-mapped `pastEnrollments` on the current enrollment entity. Switching the entire
 * FE enrollment flow to use child (or updating these enrollments via separate API PUTs
 * with their IDs, and somehow updating the data in the current enrollment.pastEnrollments)
 * is necessary to fulfill this feature.
 *
 * TODO: when we add above functionality, extend this form to distinguish between
 * editing and creating a new enrollment
 */
export const EnrollmentFormForCard: React.FC<EnrollmentFormForCardProps> = ({
	formData,
	onSubmit,
	error,
	errorAlertState,
}) => {
	return (
		<Form id={`edit-enrollment`} data={formData} onSubmit={onSubmit} className="usa-form">
			<EnrollmentStartDate
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
