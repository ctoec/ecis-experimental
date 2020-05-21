import FormField from "../../../../../components/Form_New/FormField";
import React, { ChangeEvent, useContext } from "react";
import { Enrollment, FamilyDetermination } from "../../../../../generated";
import { TextInputProps, TextInput } from "../../../../../components";
import { warningForField } from "../../../../../utils/validations";
import FormContext, { useGenericContext } from "../../../../../components/Form_New/FormContext";

export const HouseholdSizeField = ({ id }: { id: number }) => {
	return (
		<div>
			<FormField<Enrollment, TextInputProps, number | null>
				getValue={data =>
					data
						.at('child')
						.at('family')
						.at('determinations')
						.find(det => det.id === id)
						.at('numberOfPeople')
				}
				parseOnChangeEvent={(e: ChangeEvent<HTMLInputElement>) => 
					parseInt(e.target.value, 10)
				}
				defaultValue={undefined} 
				inputComponent={TextInput}
				status={(data) => 
					warningForField(
						'numberOfPeople',
						data.at('child').at('family').at('determinations').find(det => det.id === id).value,
						''
					)
				}
				id={`number-of-people-${id}`}
				label="Household size"
				small
			/>
		</div>
	);
}
