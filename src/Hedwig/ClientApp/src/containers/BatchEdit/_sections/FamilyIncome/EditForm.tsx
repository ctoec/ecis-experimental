import { Form, FormSubmitButton } from '../../../../components/Form_New';
// TODO
import { BatchEditStepProps } from '../batchEditTypes';
import React from 'react';
import { Enrollment } from '../../../../generated';
import { hasValidationErrors } from '../../../../utils/validations';
import { IncomeDeterminationFieldSet } from '../../../Enrollment/_sections/FamilyIncome/Fields';
import { Button } from '@ctoec/component-library';

export const EditForm: React.FC<BatchEditStepProps> = ({ enrollment, onSubmit, onSkip }) => {
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
				<IncomeDeterminationFieldSet
					type="redetermine"
					determinationId={0}
					blockErrorDisplay={true}
				/>
			)}

			{/*
				When the enrollment has warnings due to other income determination fields
				-- which are validation errors on the determination itself (see above) --
				then display form fields to edit those determinations with validation errors 
			 */}
			{determinationsWithErrors.map((det) => (
				<IncomeDeterminationFieldSet
					key={det.id}
					type="edit"
					determinationId={det.id}
					blockErrorDisplay={true}
				/>
			))}

			<FormSubmitButton text="Save and next" />
			<Button appearance="outline" text="Skip" onClick={onSkip} />
		</Form>
	);
};
