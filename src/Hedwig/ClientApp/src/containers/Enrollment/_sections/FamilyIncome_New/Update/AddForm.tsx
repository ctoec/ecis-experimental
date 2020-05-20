import React from 'react';
import { Enrollment } from "../../../../../generated";
import { NumberOfPeopleField, AnnualHouseholdIncomeField, DeterminationDateField } from "../Fields/Fields";
import { Button } from "../../../../../components";
import FormSubmitButton from "../../../../../components/Form/FormSubmitButton";
import { FormFieldSet } from '../../../../../components/Form_New/FormFieldSet';
import Form from '../../../../../components/Form_New/Form';
export const AddForm = ({
	formData,
	onCancel,
	onSubmit
}:
	{
		formData: Enrollment;
		onCancel: () => void;
		onSubmit: (_: Enrollment) => void;
	}
) => {
	return (						
			<Form
				id="determine-family-income"
				data={formData}
				onSubmit={onSubmit}
			>
				<FormFieldSet<Enrollment>
					id="redetermine-family-income"
					legend="Redetermine family income"
					showLegend={true}
				>
					<NumberOfPeopleField {...0} />
					<AnnualHouseholdIncomeField {...0} />
					<DeterminationDateField {...0} />
					<Button
						text="Cancel"
						appearance="outline"
						onClick={onCancel}
					/>
				</FormFieldSet>
				<FormSubmitButton  text="Save"/>
			</Form>
	);
}
