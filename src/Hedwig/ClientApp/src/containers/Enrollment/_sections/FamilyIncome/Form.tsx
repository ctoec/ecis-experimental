/**
 * A collection of functional wrappers for React components that are
 * commonly used in the FamilyIncome edit/update forms
 */

import React from 'react';
import FormField from '../../../../components/Form/FormField';
import {
	TextInputProps,
	TextInput,
	ChoiceListProps,
	ChoiceList,
	DateInputProps,
	DateInput,
} from '../../../../components';
import { Enrollment } from '../../../../generated';
import {
	initialLoadErrorGuard,
	warningForField,
	warningForFieldSet,
} from '../../../../utils/validations';
import idx from 'idx';
import parseCurrencyFromString from '../../../../utils/parseCurrencyFromString';
import currencyFormatter from '../../../../utils/currencyFormatter';
import notNullOrUndefined from '../../../../utils/notNullOrUndefined';
import moment, { Moment } from 'moment';

export const householdSizeField = (index: number) => (
	<FormField<Enrollment, TextInputProps, number | null, { initialLoad: boolean }>
		field={data =>
			data
				.at('child')
				.at('family')
				.at('determinations')
				.at(index)
				.at('numberOfPeople')
		}
		parseValue={_ => parseInt(_.replace(/[^0-9.]/g, ''), 10) || null}
		render={props => {
			const numberOfPeople = props.data;
			const { initialLoad } = props.additionalInformation;
			const determination =
				idx(props.containingData, _ => _.child.family.determinations[index]) || undefined;
			return (
				<TextInput
					type="input"
					id={`numberOfPeople-${index}`}
					label="Household size"
					defaultValue={numberOfPeople ? '' + numberOfPeople : ''}
					onBlur={event => (event.target.value = numberOfPeople ? '' + numberOfPeople : '')}
					status={initialLoadErrorGuard(
						initialLoad,
						warningForField('numberOfPeople', determination ? determination : null, '')
					)}
					small
					{...props}
				/>
			);
		}}
	/>
);

export const incomeDisclosedField = (index: number) => (
	<FormField<Enrollment, ChoiceListProps, boolean, { initialLoad: boolean }>
		field={data =>
			data
				.at('child')
				.at('family')
				.at('determinations')
				.at(index)
				.at('notDisclosed')
		}
		parseValue={(_, event) => !!event.target.checked}
		render={props => {
			const notDisclosed = props.data;
			const determination =
				idx(props.containingData, _ => _.child.family.determinations[index]) || undefined;
			return (
				<ChoiceList
					type="check"
					legend="Family income disclosure"
					id={`family-income-disclosed-${index}`}
					className="margin-top-3"
					selected={notDisclosed ? ['familyIncomeNotDisclosed'] : undefined}
					options={[
						{
							text: 'Family income not disclosed',
							value: 'familyIncomeNotDisclosed',
						},
					]}
					status={warningForFieldSet(
						'family-income',
						['notDisclosed'],
						determination ? determination : null,
						'Income information must be disclosed for CDC funded enrollments'
					)}
					{...props}
				/>
			);
		}}
	/>
);

export const annualHouseholdIncomeField = (index: number) => (
	<FormField<Enrollment, TextInputProps, number | null, { initialLoad: boolean }>
		field={data =>
			data
				.at('child')
				.at('family')
				.at('determinations')
				.at(index)
				.at('income')
		}
		parseValue={_ => parseCurrencyFromString(_)}
		render={props => {
			const determination =
				idx(props.containingData, _ => _.child.family.determinations[index]) || undefined;
			const income = props.data;
			const { initialLoad } = props.additionalInformation;
			return (
				<TextInput
					type="input"
					id={`income-${index}`}
					label="Annual household income"
					defaultValue={currencyFormatter(income)}
					onBlur={event =>
						(event.target.value = notNullOrUndefined(income) ? currencyFormatter(income) : '')
					}
					status={initialLoadErrorGuard(
						initialLoad,
						warningForField('income', determination ? determination : null, '')
					)}
					{...props}
				/>
			);
		}}
	/>
);

export const determinationDateField = (index: number, forceBlur: boolean = false, defaultDate?: Moment) => (
	<FormField<Enrollment, DateInputProps, Date | null, { initialLoad: boolean }>
		field={data =>
			data
				.at('child')
				.at('family')
				.at('determinations')
				.at(index)
				.at('determinationDate')
		}
		parseValue={_ => (_ ? _.toDate() : null)}
		render={props => {
			const determinationDate = props.data;
			const determination =
				idx(props.containingData, _ => _.child.family.determinations[index]) || undefined;
			const { initialLoad } = props.additionalInformation;
			const date = determinationDate ? moment(determinationDate) : defaultDate;
			return (
				<DateInput
					label="Date of income determination"
					id={`income-determination-date-${index}`}
					date={date}
					status={initialLoadErrorGuard(
						initialLoad,
						warningForField(
							'determinationDate',
							determination ? determination : null,
							!determinationDate ? '' : undefined
						)
					)}
					forceBlur={forceBlur}
					{...props}
				/>
			);
		}}
	/>
);
