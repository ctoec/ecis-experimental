import React from 'react';
import { Enrollment } from "../../../../../../generated"
import { Form, FormSubmitButton } from "../../../../../../components/Form_New";
import { StartDateField } from '../../Fields/StartDate';
import { AgeGroupField } from '../../Fields/AgeGroup';
import { Button } from '../../../../../../components';

type EnrollmentFormForCardProps = {
	formData: Enrollment;
	onSubmit: (_:Enrollment) => void;
	onCancel?: () => void;
};

// For now, only edit
// For now, only edit current enrollment 
// (b/c other enrollments are displayed via "past enrollments",
// so they're not updateable thru the API)
export const EnrollmentFormForCard: React.FC<EnrollmentFormForCardProps> = ({
	formData,
	onSubmit,
	onCancel
}) => {
	return (
		<Form
			id={`edit-enrollment`}
			data={formData}
			onSubmit={onSubmit}
			className="usa-form"
		>
			<StartDateField initialLoad={false} />
			<AgeGroupField  initialLoad={false} />
			<div>
 				<Button
					text="Cancel"
					appearance="outline"
					onClick={() =>  onCancel && onCancel()}
				/>
				<FormSubmitButton text="Save edits" />
			</div>
		</Form>
	);
}
