import FormField from "../../../../../components/Form_New/FormField"
import React from "react"
import { Enrollment, FamilyDetermination } from "../../../../../generated"
import { DateInput, DateInputProps } from "../../../../../components"
import { warningForField } from "../../../../../utils/validations"

export const DeterminationDateField = ({ id }: { id: number }) => {
	return <FormField<Enrollment, DateInputProps, Date|null>
		getValue={data => 
			data
				.at('child')
				.at('family')
				.at('determinations')
				.find(det => det.id === id)
				.at('determinationDate')
		}
		parseOnChangeEvent={e => (e as any).toDate()}
		inputComponent={DateInput}
		status={(data) => 
			warningForField(
				'determinationDate',
				data.at('child').at('family').at('determinations').find(det => det.id === id).value,
				''
			)
		}
		id={`determination-date-${id}`}
		label="Determination date"
	/>
}
