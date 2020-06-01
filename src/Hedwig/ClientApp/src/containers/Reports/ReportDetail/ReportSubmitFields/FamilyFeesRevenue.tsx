import React from 'react';
import { CdcReport } from '../../../../generated';
import { TextInput } from '../../../../components';
import {
	ValidationResponse,
	displayValidationStatus,
} from '../../../../utils/validations/displayValidationStatus';
import { ErrorAlertState } from '../../../../hooks/useCatchAllErrorAlert';
import parseCurrencyFromString from '../../../../utils/parseCurrencyFromString';
import { REQUIRED_FOR_REPORT } from '../../../../utils/validations/messageStrings';
import currencyFormatter from '../../../../utils/currencyFormatter';
import FormContext, { useGenericContext } from '../../../../components/Form_New/FormContext';
import produce from 'immer';
import set from 'lodash/set';

type FamilyFeesRevenueFieldProps = {
	disabled: boolean;
	error?: ValidationResponse | null;
	errorAlertState?: ErrorAlertState;
};

/**
 * Component for entering the revenue from family fee sources.
 */
export const FamilyFeesRevenueField: React.FC<FamilyFeesRevenueFieldProps> = ({
	disabled,
	error,
	errorAlertState,
}) => {
	const { data, dataDriller, updateData } = useGenericContext<CdcReport>(FormContext);
	const familyFeesRevenue = data.familyFeesRevenue;

	return (
		<TextInput
			id="familyfees-revenue"
			type="input"
			label={<span className="text-bold">Family Fees</span>}
			disabled={disabled}
			defaultValue={currencyFormatter(familyFeesRevenue || 0)}
			onBlur={(event) =>
				(event.target.value =
					familyFeesRevenue !== null ? currencyFormatter(familyFeesRevenue) : '')
			}
			onChange={(e) => {
				updateData(
					produce(data, (draft) =>
						set(
							draft,
							dataDriller.at('familyFeesRevenue').path,
							parseCurrencyFromString(e.target.value)
						)
					)
				);
			}}
			status={displayValidationStatus([
				{
					type: 'error',
					response: error || null,
					field: 'familyfeesrevenue',
					message: REQUIRED_FOR_REPORT,
					errorAlertState,
				},
			])}
			className="flex-fill"
		/>
	);
};
