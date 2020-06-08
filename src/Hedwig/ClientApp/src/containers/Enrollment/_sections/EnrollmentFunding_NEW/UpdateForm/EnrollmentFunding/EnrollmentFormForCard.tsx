import React from 'react';
import { Enrollment } from "../../../../../../generated"
import { Form, FormSubmitButton } from "../../../../../../components/Form_New";
import { EnrollmentStartDate } from '../../Fields/EnrollmentStartDate';
import { AgeGroupField } from '../../Fields/AgeGroup';
import { Button } from '../../../../../../components';
import { ExpandCard } from '../../../../../../components/Card/ExpandCard';

type EnrollmentFormForCardProps = {
	formData: Enrollment;
	onSubmit: (_: Enrollment) => void;
};

// For now, only edit AND only current enrollment 
// (b/c other enrollments are displayed via "past enrollments",
// so they're not updateable thru the API)

/**
 * TODO: when we add functionality to create new enrollment, extend this form to distinguish
 * - Button not wrapped in ExpandCard. Instead: takes in & invokes onCancel prop, which
 * 	 should set some 'showAddNewEnrollment' state var from calling context to false
 */
export const EnrollmentFormForCard: React.FC<EnrollmentFormForCardProps> = ({
	// PR comment "I dont think we need to make this reusable for when we switch enrollments -- that can be it's own form b/c it also includes: site, funding. This can just be EnrollmentEditFormForCard"
	formData,
	onSubmit,
}) => {
	return (
		<Form
			id={`edit-enrollment`}
			data={formData}
			onSubmit={onSubmit}
			className="usa-form"
		>
			<EnrollmentStartDate initialLoad={false} />
			{/* TODO: AgeGroupField needs to blow away all of the fundings on change */}
			<AgeGroupField initialLoad={false} />
			<ExpandCard>
				<Button
					text="Cancel"
					appearance="outline"
				/>
			</ExpandCard>
			<FormSubmitButton text="Save edits" />
		</Form>
	);
}
