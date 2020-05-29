import FormField from '../../../../../components/Form_New/FormField';
import { Enrollment, FamilyDetermination } from '../../../../../generated';
import React, { ChangeEvent, FC } from 'react';
import { TextInputProps, TextInput } from '../../../../../components';
import parseCurrencyFromString from '../../../../../utils/parseCurrencyFromString';
import currencyFormatter from '../../../../../utils/currencyFormatter';
import { displayValidationStatus } from '../../../../../utils/validations/displayValidationStatus';
import { FamilyIncomeFormFieldProps } from './common';

export const AnnualHouseholdIncomeField: React.FC<FamilyIncomeFormFieldProps> = ({ determinationId }) => {
	return (
		<FormField<Enrollment, TextInputProps, number | null>
			getValue={(data) =>
				data
					.at('child')
					.at('family')
					.at('determinations')
					.find((det) => det.id === determinationId)
					.at('income')
			}
			parseOnChangeEvent={(e: ChangeEvent<HTMLInputElement>) =>
				parseCurrencyFromString(e.target.value)
			}
			preprocessForDisplay={(income) => currencyFormatter(income)}
			inputComponent={TextInput}
			status={(data) =>
				displayValidationStatus([
					{
						type: 'warning',
						response:
							data
								.at('child')
								.at('family')
								.at('determinations')
								.find((det) => det.id === determinationId)
								.at('validationErrors').value || null,
						field: 'income',
					},
				])
			}
			id={`income-${determinationId}`}
			label="Annual household income"
			onBlur={(e: ChangeEvent<HTMLInputElement>) => {
				e.target.value = currencyFormatter(parseInt(e.target.value) || null);
			}}
		/>
	);
};
