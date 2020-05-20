import React, { useState } from 'react';
import { Enrollment, FamilyDetermination } from "../../../../../generated";
import { HouseholdSizeField, AnnualHouseholdIncomeField, DeterminationDateField, WithNotDisclosedField } from "../Fields";
import { Button } from "../../../../../components";
import FormSubmitButton from "../../../../../components/Form/FormSubmitButton";
import { FormFieldSet } from '../../../../../components/Form_New/FormFieldSet';
import Form from '../../../../../components/Form_New/Form';
import { warningForFieldSet } from '../../../../../utils/validations';
import { REQUIRED_FOR_OEC_REPORTING } from '../../../../../utils/validations/messageStrings';
import { ExpandCard } from '../../../../../components/Card/ExpandCard';
import { WithNewDetermination } from '../Fields/WithNewDetermination';

export const CardForm = ({
	determinationId,
	isEdit,
	formData,
	onSubmit,
	onCancel,
}:
	{
		determinationId: number;
		isEdit: boolean;
		formData: Enrollment;
		onSubmit: (_: Enrollment) => void;
		onCancel?: () => void;
	}
) => {
	const [canceled, setCanceled] = useState(false);
	return (						
			<Form
				id={`update-family-income-${determinationId}`}
				data={formData}
				onSubmit={onSubmit}
			>
				<p className="text-bold font-sans-lg">
					{isEdit ? 'Redetermine family income' : 'Edit family income'}
				</p>
				<FormFieldSet<Enrollment>
					id="redetermine-family-income"
					legend="Redetermine family income"
					//status is not necessary when creating a new record
					status={isEdit ? 
						(data) => {
							const det = data.at('child').at('family').at('determinations').find((det: FamilyDetermination) => det.id === determinationId).value as FamilyDetermination;
							return warningForFieldSet(
								'edit-family-income-determination',
								['numberOfPeople', 'income', !det.determinationDate ? 'determinationDate' : ''],
								det,
								REQUIRED_FOR_OEC_REPORTING
							)
						} : (_) => undefined
					}
				>
					<WithNewDetermination shouldCreate={!isEdit} shouldCleanUp={canceled}>
						<HouseholdSizeField id={determinationId} />
						<AnnualHouseholdIncomeField id={determinationId} />
						<DeterminationDateField id={determinationId}/>
					</WithNewDetermination>
				</FormFieldSet>
				<div className="display-flex">
					<div className="usa-form">
						{!isEdit ?
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
							</ExpandCard>
						}
					<FormSubmitButton text={isEdit ? 'Save' : 'Redetermine'}/>
					</div>
				</div>
			</Form>
	);
}
