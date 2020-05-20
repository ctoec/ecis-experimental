import React from 'react';
import { Enrollment, FamilyDetermination } from "../../../../../generated";
import { NumberOfPeopleField, AnnualHouseholdIncomeField, DeterminationDateField } from "../Fields/Fields";
import { ExpandCard } from "../../../../../components/Card/ExpandCard";
import { Button } from "../../../../../components";
import FormSubmitButton from "../../../../../components/Form/FormSubmitButton";
import { FormFieldSet } from '../../../../../components/Form_New/FormFieldSet';
import Form from '../../../../../components/Form_New/Form';
import { warningForFieldSet, warningForField } from '../../../../../utils/validations';
import { REQUIRED_FOR_OEC_REPORTING } from '../../../../../utils/validations/messageStrings';

export const EditForm = ({
	determinationId,
	formData,
	onSubmit
}:
	{
		determinationId: number;
		formData: Enrollment;
		onSubmit: (_: Enrollment) => void;
	}
) => {

	return (
		<Form<Enrollment>
			data={formData}
			onSubmit={onSubmit}
		>
			<FormFieldSet<Enrollment>
				id="edit-family-income-determination"
				legend="Edit family income determination"
				showLegend={true}
				status={(data) => {
					const det = data.at('child').at('family').at('determinations').find((det: FamilyDetermination) => det.id === determinationId).value as FamilyDetermination;
					return warningForFieldSet(
						'edit-family-income-determination',
						['numberOfPeople', 'income', !det.determinationDate ? 'determinationDate' : ''],
						det,
						REQUIRED_FOR_OEC_REPORTING
					) || warningForFieldSet(
						'edit-family-income-determination',
						[]
					)
					//TODO: where/how to surface 
				}}
			>
				<NumberOfPeopleField {...determinationId}/>
				<AnnualHouseholdIncomeField {...determinationId}/>
				<DeterminationDateField {...determinationId}/>
				<ExpandCard>
					<Button 
						text="Cancel"
						appearance="outline"
					/>
				</ExpandCard>
				<FormSubmitButton text="Save"/>
			</FormFieldSet>
		</Form>
	)
}
