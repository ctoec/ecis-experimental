import React from 'react';
import { BatchEditStepProps } from '../batchEditTypes';
import { Enrollment } from '../../../../generated';
import { hasValidationErrors } from '../../../../utils/validations';
import { AddressFieldset } from '../../../Enrollment/_sections/FamilyInfo/Fields';
import { Button, Form, FormSubmitButton } from '@ctoec/component-library';

export const EditForm: React.FC<BatchEditStepProps> = ({ enrollment, onSubmit, onSkip }) => {
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
			{hasValidationErrors(family, ['addressLine1', 'town', 'state', 'zip']) && (
				<>
					<h4>Address</h4>
					<AddressFieldset blockErrorDisplay={true} />
				</>
			)}

			<FormSubmitButton text="Save and next" />
			<Button appearance="outline" text="Skip" onClick={onSkip} />
		</Form>
	);
};
