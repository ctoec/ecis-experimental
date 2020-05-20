import React, { useState } from 'react';
import { Enrollment, FamilyDetermination } from "../../../../../generated";
import { HouseholdSizeField, AnnualHouseholdIncomeField, DeterminationDateField, WithNewDetermination } from "../Fields";
import { Button } from "../../../../../components";
import FormSubmitButton from "../../../../../components/Form_New/FormSubmitButton";
import { FormFieldSet } from '../../../../../components/Form_New/FormFieldSet';
import Form from '../../../../../components/Form_New/Form';
import { warningForFieldSet } from '../../../../../utils/validations';
import { REQUIRED_FOR_OEC_REPORTING } from '../../../../../utils/validations/messageStrings';
import { ExpandCard } from '../../../../../components/Card/ExpandCard';
import { TObjectDriller } from '../../../../../components/Form_New/ObjectDriller';

const CardForm = ({
	determinationId,
	isEditExpansion,
	formData,
	onSubmit,
	onCancel,
}:
	{
		determinationId: number;
		isEditExpansion: boolean;
		formData: Enrollment;
		onSubmit: (_: Enrollment) => void;
		onCancel?: () => void;
	}
) => {
	const [canceled, setCanceled] = useState(false);

	// status is only necessary for edit
	const status = !isEditExpansion ? undefined
		: (data: TObjectDriller<NonNullable<Enrollment>>) => {
			const det = data.at('child').at('family').at('determinations').find((det: FamilyDetermination) => det.id === determinationId).value as FamilyDetermination;
			return warningForFieldSet(
				'edit-family-income-determination',
				['numberOfPeople', 'income', !det.determinationDate ? 'determinationDate' : ''],
				det,
				REQUIRED_FOR_OEC_REPORTING
			)
		};

	// Use a basic button to cancel adding new determination,
	// or an ExpandCard button to cancel editing an existing determination
	const expandElement = !isEditExpansion ? 
		<Button
			text="Cancel"
			appearance="outline"
			onClick={() => {
				setCanceled(true);
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
					<WithNewDetermination shouldCreate={!isEditExpansion} shouldCleanUp={canceled}>
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
