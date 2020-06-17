import { Form, FormSubmitButton } from '../../../../components/Form_New';
import { BatchEditStepProps } from '../batchEditTypes';
import React from 'react';
import { Enrollment } from '../../../../generated';
import { hasValidationErrors } from '../../../../utils/validations';
import { IncomeDeterminationFieldSet } from '../../../Enrollment/_sections/FamilyIncome/Fields';
import { Button } from '../../../../components';
import useCatchAllErrorAlert from '../../../../hooks/useCatchAllErrorAlert';

export const EditForm: React.FC<BatchEditStepProps> = ({ enrollment, error, onSubmit, onSkip }) => {
	if (!enrollment) {
		throw new Error('Section rendered without enrollment');
	}

	useCatchAllErrorAlert(error);
	const determinationsWithErrors = (enrollment.child?.family?.determinations || []).filter(
		(det) => !!det.validationErrors && det.validationErrors.length
	);

	return (
		<Form<Enrollment>
			className="usa-form"
			data={enrollment}
			onSubmit={onSubmit}
			noValidate
			autoComplete="off"
		>
			{/* 
				NOTE: This validation is not currently active; TODO: test when it is activated
				When the enrollment has warning due to expired income determination
				-- which is NOT a sub-object validation -- 
				then display form fields to redetermine income (create new income determination)
			 */}
			{hasValidationErrors(enrollment.child?.family, ['determinations'], true) && (
				<>
					<h3>Redetermine family income</h3>
					<IncomeDeterminationFieldSet
						type="redetermine"
						determinationId={0}
						errorDisplayGuard={true}
					/>
				</>
			)}

			{/*
				When the enrollment has warnings due to other income determination fields
				-- which are sub-object validations --
				then display form fields to edit those determinations with validation errors 
			 */}
			{determinationsWithErrors.length && (
				<>
					<h3>Family income determinations</h3>
					{determinationsWithErrors.map((det) => (
						<IncomeDeterminationFieldSet
							type="edit"
							determinationId={det.id}
							errorDisplayGuard={true}
						/>
					))}
				</>
			)}

			<FormSubmitButton text="Save and next" />
			<Button appearance="outline" text="skip" onClick={onSkip} />
		</Form>
	);
};
