import FormField from "../../../../../components/Form_New/FormField";
import React, { ChangeEvent } from "react";
import { Enrollment, FamilyDetermination } from "../../../../../generated";
import { TextInputProps, TextInput } from "../../../../../components";
import { warningForField } from "../../../../../utils/validations";

export const HouseholdSizeField = ({ id }: { id: number }) => {
	return <FormField<Enrollment, TextInputProps, number | null>
		getValue={data =>
			data
				.at('child')
				.at('family')
				.at('determinations')
				.find((det:FamilyDetermination) => det.id === id)
				.at('numberOfPeople')
		}
		parseOnChangeEvent={(e: ChangeEvent<HTMLInputElement>) => 
			parseInt(e.target.value, 10)
		}
		inputComponent={TextInput}
		props={{
			id: `number-of-people-${id}`,
			label: 'Number of people',
			small: true
		}}
		status={(data) => 
			warningForField(
				'numberOfPeople',
				data.at('child').at('family').at('determinations').find((det: FamilyDetermination) => det.id === id).value,
				''
			)
		}
		/>
}
