import React from 'react';
import { BatchEditStepProps } from '../batchEditTypes';
import { Enrollment } from '../../../../generated';
import { Form, FormSubmitButton } from '../../../../components/Form_New';
import { hasValidationErrors } from '../../../../utils/validations';
import { AddressFieldset } from '../../../Enrollment/_sections/FamilyInfo/Fields';
import { Button } from '../../../../components';

export const EditForm: React.FC<BatchEditStepProps> = ({
	enrollment,
	error,
	onSubmit,
	onSkip,
}) => {
	if (!enrollment) {
		throw new Error("Section rendered without enrollment");
	}

	console.log("enrollment", enrollment);

	// Family will always exist (because we create it if missing in SingleEnrollmentEdit)
	const family = enrollment.child?.family;
	return (
		<Form<Enrollment>
			className="usa-form"
			data={enrollment}
			onSubmit={onSubmit}
			noValidate 
			autoComplete="off"
		> 
			{hasValidationErrors(family, ['addressLine1', 'town', 'state', 'zip']) && 
				<>
					<h3>Address</h3>
					<AddressFieldset errorDisplayGuard={true} />
				</>
			}

			<FormSubmitButton text="Save and next" />
			<Button appearance="outline" text="Skip" onClick={onSkip} />
		</Form>
	)
}
