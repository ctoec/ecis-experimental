import React from 'react';
import { Form, FormSubmitButton } from '../../../../components/Form_New';
import { Enrollment } from '../../../../generated';
import { BatchEditStepProps } from '../batchEditTypes';
import { hasValidationErrors } from '../../../../utils/validations';

export const EditForm: React.FC<BatchEditStepProps> = ({ enrollment, error, onSubmit }) => {
	return (
		<Form<Enrollment>
			className="usa-form"
			data={enrollment}
			onSubmit={onSubmit}
			noValidate
			autoComplete="off"
		>
			{hasValidationErrors(enrollment, ['entry', 'ageGroup'])  && (
				<>
					<h3>Enrollment</h3>
					{hasValidationErrors(enrollment, ['entry']) && (
						<EnrollmentStartDateField 
					)}
			)}
		</Form>
	)
}
