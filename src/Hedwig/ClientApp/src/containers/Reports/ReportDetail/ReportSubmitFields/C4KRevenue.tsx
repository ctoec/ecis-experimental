import React from 'react';
import { CdcReport, Enrollment } from '../../../../generated';
import { TextInput } from '../../../../components';
import {
	ValidationResponse,
	displayValidationStatus,
} from '../../../../utils/validations/displayValidationStatus';
import { ErrorAlertState } from '../../../../hooks/useCatchAllErrorAlert';
import parseCurrencyFromString from '../../../../utils/parseCurrencyFromString';
import { REQUIRED_FOR_REPORT } from '../../../../utils/validations/messageStrings';
import { activeC4kFundingAsOf } from '../../../../utils/models';
import pluralize from 'pluralize';
import currencyFormatter from '../../../../utils/currencyFormatter';
import FormContext, { useGenericContext } from '../../../../components/Form_New/FormContext';
import produce from 'immer';
import set from 'lodash/set';

type C4KRevenueFieldProps = {
	disabled: boolean;
	enrollments: Enrollment[];
	submittedAt: Date | undefined;
	error?: ValidationResponse | null;
	errorAlertState?: ErrorAlertState;
};
/**
 * Component for entering the revenue from C4K sources.
 */
export const C4KRevenueField: React.FC<C4KRevenueFieldProps> = ({
	disabled,
	enrollments,
	submittedAt,
	error,
	errorAlertState,
}) => {
	const { data, dataDriller, updateData } = useGenericContext<CdcReport>(FormContext);
	const c4KRevenue = data.c4KRevenue;

	var c4kFundedEnrollments = (enrollments || []).filter(
		(enrollment) => !!activeC4kFundingAsOf(enrollment, submittedAt || undefined)
	);
	var childIds: string[] = [];
	c4kFundedEnrollments.forEach((enrollment) => {
		const childId = enrollment.childId;
		if (childIds.indexOf(childId) < 0) {
			childIds.push(childId);
		}
	});
	const care4KidsCount = childIds.length;

	return (
		<TextInput
			id="c4k-revenue"
			type="input"
			label={
				<React.Fragment>
					<span className="text-bold">Care 4 Kids</span>
					<span>
						{' '}
						({care4KidsCount} {pluralize('kid', care4KidsCount)} receiving subsidies)
					</span>
				</React.Fragment>
			}
			defaultValue={currencyFormatter(c4KRevenue || 0)}
			onBlur={(event) =>
				(event.target.value = c4KRevenue !== null ? currencyFormatter(c4KRevenue) : '')
			}
			onChange={(e) => {
				updateData(
					produce(data, (draft) =>
						set(draft, dataDriller.at('c4KRevenue').path, parseCurrencyFromString(e.target.value))
					)
				);
			}}
			disabled={disabled}
			status={displayValidationStatus([
				{
					type: 'error',
					response: error || null,
					field: 'report.c4krevenue',
					message: REQUIRED_FOR_REPORT,
					errorAlertState,
				},
			])}
			className="flex-fill"
		/>
	);
};
