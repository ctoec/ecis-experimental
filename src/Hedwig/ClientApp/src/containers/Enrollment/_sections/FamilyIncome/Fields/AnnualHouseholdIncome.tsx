import FormField from '../../../../../components/Form_New/FormField';
import { Enrollment } from '../../../../../generated';
import React, { ChangeEvent } from 'react';
import { TextInputProps, TextInput } from '@ctoec/component-library';
import parseCurrencyFromString from '../../../../../utils/parseCurrencyFromString';
import currencyFormatter from '../../../../../utils/currencyFormatter';
import { displayValidationStatus } from '../../../../../utils/validations/displayValidationStatus';
import { FamilyIncomeFormFieldProps } from './common';
import { errorDisplayGuard } from '../../../../../utils/validations';

export const AnnualHouseholdIncomeField: React.FC<FamilyIncomeFormFieldProps> = ({
	determinationId,
	blockErrorDisplay = false,
}) => {
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
				errorDisplayGuard(
					blockErrorDisplay,
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
				)
			}
			id={`income-${determinationId}`}
			label="Annual household income"
			onBlur={(e: ChangeEvent<HTMLInputElement>) => {
				e.target.value = currencyFormatter(parseInt(e.target.value) || null);
			}}
		/>
	);
};
