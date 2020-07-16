import React, { useContext } from 'react';
import { Enrollment, FundingSource } from '../../../generated';
import produce from 'immer';
import set from 'lodash/set';
import { ApiError } from '../../../hooks/useApi';
import ReportingPeriodContext from '../../../contexts/ReportingPeriod/ReportingPeriodContext';
import { REQUIRED_FOR_WITHDRAWAL } from '../../../utils/validations/messageStrings';
import { displayValidationStatus } from '../../../utils/validations/displayValidationStatus';
import moment from 'moment';
import { lastNReportingPeriods, reportingPeriodFormatter } from '../../../utils/models';
import { Select, useGenericContext, FormContext } from '@ctoec/component-library';
import { ErrorAlertState } from '../../../hooks/useCatchAllErrorAlert';

type LastReportingFieldProps = {
	errorAlertState?: ErrorAlertState;
	error: ApiError | null;
};
/**
 * This component is used in Withdrawal to update the last reporting period
 * on the current cdc funding in an enrollment.
 */
export const LastReportingPeriodField: React.FC<LastReportingFieldProps> = ({
	errorAlertState,
	error,
}) => {
	const { dataDriller, updateData } = useGenericContext<Enrollment>(FormContext);
	const { cdcReportingPeriods } = useContext(ReportingPeriodContext);

	const currentEndDate = dataDriller.at('exit').value;
	const firstReportingPeriod = dataDriller
		.at('fundings')
		.find((funding) => funding.source === FundingSource.CDC && !funding.lastReportingPeriod)
		.at('firstReportingPeriod').value;
	const lastFiveReportingPeriodOptions = lastNReportingPeriods(
		cdcReportingPeriods,
		currentEndDate || moment.utc().toDate(),
		5
	);
	// Only show reporting period options that are after the first reporting period
	const reportingPeriodOptions = lastFiveReportingPeriodOptions.filter(
		(reportingPeriod) => reportingPeriod.periodEnd >= firstReportingPeriod.periodStart
	);

	return (
		<Select
			id="last-reporting-period"
			label="Last reporting period"
			options={reportingPeriodOptions.map((period) => ({
				value: '' + period.id,
				text: reportingPeriodFormatter(period, { extended: true }),
			}))}
			onChange={(event) => {
				const newReportingPeriodId = parseInt(event.target.value);
				// Update the last reporting period id on the current cdc funding
				updateData((enrollment) =>
					produce<Enrollment>(enrollment, (draft) =>
						set(
							draft,
							dataDriller
								.at('fundings')
								.find(
									(funding) => funding.source === FundingSource.CDC && !funding.lastReportingPeriod
								)
								.at('lastReportingPeriodId').path,
							newReportingPeriodId
						)
					)
				);
			}}
			status={displayValidationStatus([
				{
					type: 'error',
					response: error,
					field: 'fundings',
					message: REQUIRED_FOR_WITHDRAWAL,
					errorAlertState,
				},
				{
					type: 'error',
					response: error,
					field: 'fundings.lastReportingPeriod',
					useValidationErrorMessage: true,
					errorAlertState,
				},
			])}
		/>
	);
};
