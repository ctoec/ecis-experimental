import FormField from "../../../../../components/Form_New/FormField"
import React from "react"
import { Enrollment, FamilyDetermination } from "../../../../../generated"
import { DateInput, DateInputProps } from "../../../../../components"
import { warningForField } from "../../../../../utils/validations"

export const DeterminationDate = ({ id }: { id: number }) => {
	return <FormField<Enrollment, DateInputProps, Date|null>
	getValue={data => 
		data
			.at('child')
			.at('family')
			.at('determinations')
			.find((det: FamilyDetermination) => det.id === id)
			.at('determinationDate')
	}
	parseOnChangeEvent={e => (e as any).toDate()}
	inputComponent={DateInput}
	props={{
		id: `determination-date-${id}`,
		label: 'Determination date'
	}}
	status={(data) => {
		const det = data.at('child').at('family').at('determinations').find((det: FamilyDetermination) => det.id === id).value as FamilyDetermination;
		// Only message here if the field is missing
		// the field has a value, that means the error is about the date, 
		// so the determination is overdue! 
		if(!det.determinationDate) {
			return warningForField(
				'determinationDate',
				data.at('child').at('family').at('determinations').find((det: FamilyDetermination) => det.id === id).value,
				''
			);
		}
	}}
	/>
}
