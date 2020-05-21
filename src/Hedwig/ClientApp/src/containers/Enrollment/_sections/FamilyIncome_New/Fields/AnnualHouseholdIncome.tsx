import FormField from "../../../../../components/Form_New/FormField"
import { Enrollment, FamilyDetermination } from "../../../../../generated"
import React, { ChangeEvent } from "react"
import { TextInputProps, TextInput } from "../../../../../components"
import parseCurrencyFromString from "../../../../../utils/parseCurrencyFromString"
import currencyFormatter from "../../../../../utils/currencyFormatter"
import { displayValidationStatus } from "../../../../../utils/validations/displayValidationStatus"

export const AnnualHouseholdIncomeField = ({ id }: { id: number}) => {
	return (
		<div>
			<FormField<Enrollment, TextInputProps, number | null>
				getValue={data => 
					data
						.at('child')
						.at('family')
						.at('determinations')
						.find((det:FamilyDetermination) => det.id === id)
						.at('income')
				}
				parseOnChangeEvent={(e: ChangeEvent<HTMLInputElement>) => parseCurrencyFromString(e.target.value)}
				preprocessForDisplay={income => currencyFormatter(income)}
				inputComponent={TextInput}
				status={(data) => 
					displayValidationStatus([{
						type: 'warning',
						response: data.at('child').at('family').at('determinations').find(det => det.id === id).at('validationErrors').value || null,
						field: 'income',
					}])
				}
				id={`income-${id}`}
				label='Annual household income'
				onBlur={(e: ChangeEvent<HTMLInputElement>) => { e.target.value = currencyFormatter(parseInt(e.target.value))} }
			/>
		</div>
	)
}
