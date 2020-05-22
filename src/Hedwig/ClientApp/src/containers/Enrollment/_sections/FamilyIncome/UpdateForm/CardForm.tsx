import React, { useState } from 'react';
import { Enrollment } from "../../../../../generated";
import { HouseholdSizeField, AnnualHouseholdIncomeField, DeterminationDateField, WithNewDetermination } from "../Fields";
import { Button } from "../../../../../components";
import FormSubmitButton from "../../../../../components/Form_New/FormSubmitButton";
import { FormFieldSet } from '../../../../../components/Form_New/FormFieldSet';
import Form from '../../../../../components/Form_New/Form';
import { REQUIRED_FOR_OEC_REPORTING } from '../../../../../utils/validations/messageStrings';
import { ExpandCard } from '../../../../../components/Card/ExpandCard';
import { TObjectDriller } from '../../../../../components/Form_New/ObjectDriller';
import { displayValidationStatus } from '../../../../../utils/validations/displayValidationStatus';

/**
 * The single-determination form to be embedded in Cards in the UpdateForm.
 *
 * The component relies on determinationId to determine which flavor of CardForm it is:
 * - determinationId = 0: displayed in a Card as the primary content to create a new determination
 * - determinationId != 0: displayed in a CardExpansion as the expanded context to edit existing determination with given id
 */
const CardForm = ({
	determinationId,
	formData,
	onSubmit,
	onCancel,
}:
	{
		determinationId: number;
		formData: Enrollment;
		onSubmit: (_: Enrollment) => void;
		onCancel?: () => void;
	}
) => {
	// determinationId = 0 means new determination, not edit
	const isEditExpansion = determinationId !== 0;

	// status is only necessary for edit
	const status = !isEditExpansion ? undefined
		: (data: TObjectDriller<NonNullable<Enrollment>>) => 
			displayValidationStatus([{
				type: 'warning',
				response: data.at('child').at('family').at('determinations').find(det => det.id === determinationId).at('validationErrors').value || null,
				fields: ['numberOfPeople', 'income', 'determinationDate'],
				message: REQUIRED_FOR_OEC_REPORTING,
			}]);

	// Use a basic button to cancel adding new determination,
	// or an ExpandCard button to cancel editing an existing determination
	const expandElement = !isEditExpansion ? 
		<Button
			text="Cancel"
			appearance="outline"
			onClick={() => {
				if(onCancel) onCancel();
			}}
		/> :
		<ExpandCard>
			<Button
				text="Cancel"
					appearance="outline"
			/>
		</ExpandCard>;

	return (						
			<Form
				id={`update-family-income-${determinationId}`}
				data={formData}
				onSubmit={onSubmit}
				className="update-family-income-form"
			>
				<p className="text-bold font-sans-lg">
					{isEditExpansion ? 'Edit family income' : 'Redetermine family income'}
				</p>
				<FormFieldSet<Enrollment>
					id="redetermine-family-income"
					legend="Redetermine family income"
					status={status}
				>
					<WithNewDetermination shouldCreate={!isEditExpansion}>
						<HouseholdSizeField id={determinationId} />
						<AnnualHouseholdIncomeField id={determinationId} />
						<DeterminationDateField id={determinationId}/>
					</WithNewDetermination>
				</FormFieldSet>
				<div className="display-flex">
					<div className="usa-form">
						{expandElement}
					<FormSubmitButton text={isEditExpansion ? 'Save' : 'Redetermine'}/>
					</div>
				</div>
			</Form>
	);
}

export default CardForm;
