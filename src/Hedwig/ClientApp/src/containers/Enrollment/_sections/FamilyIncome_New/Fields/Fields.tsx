import { Enrollment, FamilyDetermination } from "../../../../../generated";
import FormField from "../../../../../components/Form_New/FormField";
import React, { ChangeEvent, useState, useEffect, PropsWithChildren, FC } from "react";
import { TextInputProps, TextInput, DateInputProps, DateInput, FieldSet, Alert } from "../../../../../components";
import parseCurrencyFromString from "../../../../../utils/parseCurrencyFromString";
import currencyFormatter from "../../../../../utils/currencyFormatter";
import Checkbox from "../../../../../components/Checkbox/Checkbox";
import FormContext, { useGenericContext } from "../../../../../components/Form_New/FormContext";
import { ObjectDriller } from "../../../../../components/Form_New/ObjectDriller";
import { hasValidationErrors } from "../../../../../utils/validations";
import produce from "immer";
import { set } from "immer/dist/common";

/**
 * TODO:
 * - pass in error to use in to use in status func
 * - revisit status func typing: does it need error param?
 * - define status funcs
 */

export const NumberOfPeopleField = (id: number) => {
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
			label: 'Number of people'
		}}
	/>
}

export const AnnualHouseholdIncomeField = (id: number) => {
	return <FormField<Enrollment, TextInputProps, number | null>
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
		props={{
			id: `income-${id}`,
			label: 'Annual household income',
			onBlur: (event: ChangeEvent<HTMLInputElement>) => { event.target.value = currencyFormatter(parseInt(event.target.value))}
		}}
	/>
}

export const DeterminationDateField = (id: number) => {
	return <FormField<Enrollment, DateInputProps, Date>
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
	/>
}

export const WithNotDisclosedField = ({children: otherFields}: PropsWithChildren<{}>) => {
	const { data, updateData } = useGenericContext<Enrollment>(FormContext);
	const dataDriller = new ObjectDriller<Enrollment>(data);

	const det = dataDriller.at('child').at('family').at('determinations').find((det: FamilyDetermination) => det.id === 0).value as FamilyDetermination;
	const [hideOtherFields, setHideOtherFields] = useState(det.notDisclosed);
	const [displayAlert, setDisplayAlert] = useState(det.notDisclosed && !hasValidationErrors(det))
	
	useEffect(() => {
		setDisplayAlert(det.notDisclosed && !hasValidationErrors(det));
	}, [det]);

	return (
		<>
			{!hideOtherFields &&
				<FieldSet
				id="family-income"
				legend="Family income"
			>
				{otherFields}
			</FieldSet>
			}

			<Checkbox
				id='not-disclosed'
				text="Family income not disclosed"
				value="not-disclosed"
				onChange={e => {
					const notDisclosed = e.target.checked;
					setHideOtherFields(notDisclosed);
					
					if (notDisclosed) {
						updateData(produce<Enrollment>(
							data, draft => {set(
								draft,
								dataDriller.at('child').at('family').at('determinations').find((det: FamilyDetermination) => det.id === 0).path,
								{notDisclosed: true} as FamilyDetermination
							)}
						));
					} else {
						updateData(produce<Enrollment>(
							data, draft => {set(
								draft, 
								dataDriller.at('child').at('family').at('determinations').find((det: FamilyDetermination) => det.id === 0).path,
								{notDisclosed: false}
							)}
						))
					}
				}}
			/>
			{displayAlert &&
				<Alert
					type="info"
					text="Income information is required enroll a child in a funded space. You will not be able to assign this child to a funding space without this information."
				/>
			}
		</>
	);
}
