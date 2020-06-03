import React from 'react';
import { CdcReport, FundingSpace, FundingTime, ReportingPeriod } from '../../../../generated';
import {
	prettyFundingTime,
	prettyAge,
	getTimeSplitUtilizationsForFiscalYearOfReport,
	getFundingSpaces,
	getReportingPeriodWeeks,
	getReportingPeriodMonth,
} from '../../../../utils/models';
import {
	sumWeeksUsed,
	getSplitUtilization,
	getSplitUtilizations,
} from '../../../../utils/models/fundingTimeSplitUtilization';
import FormContext, { useGenericContext } from '../../../../components/Form_New/FormContext';
import { TextInput } from '../../../../components';
import {
	displayValidationStatus,
	ValidationResponse,
} from '../../../../utils/validations/displayValidationStatus';
import { WEEKS_USED_CANNOT_EXCEED_WEEKS_AVAILABLE } from '../../../../utils/validations/messageStrings';
import produce from 'immer';
import set from 'lodash/set';
import { ErrorAlertState } from '../../../../hooks/useCatchAllErrorAlert';

type TimeSplitUtilizationFieldProps = {
	fundingSpace: FundingSpace;
	error?: ValidationResponse | null;
	errorAlertState?: ErrorAlertState;
};
/**
 * Component for entering whether the program is accredited.
 */
export const TimeSplitUtilizationField: React.FC<TimeSplitUtilizationFieldProps> = ({
	fundingSpace,
	error,
	errorAlertState,
}) => {
	const { data: report, dataDriller, updateData } = useGenericContext<CdcReport>(FormContext);

	const reportingPeriodWeeks = getReportingPeriodWeeks(report.reportingPeriod);
	const splitTimeFundingSpaces = getFundingSpaces(
		report.organization && report.organization.fundingSpaces,
		{
			time: FundingTime.Split,
		}
	);
	const timeSplitUtilizations = getSplitUtilizations(
		report,
		splitTimeFundingSpaces,
		reportingPeriodWeeks
	);

	const timeSplit = fundingSpace.timeSplit;
	if (!timeSplit) return <></>;

	const currentFiscalYearTimeSplitUtilizations = getTimeSplitUtilizationsForFiscalYearOfReport(
		fundingSpace,
		report
	);
	const lesserTime =
		timeSplit.fullTimeWeeks < timeSplit.partTimeWeeks ? FundingTime.Full : FundingTime.Part;
	const labelText = `${prettyAge(fundingSpace.ageGroup)} services were provided ${prettyFundingTime(
		lesserTime
	)}`;

	const fiscalYearUsedWeeks = sumWeeksUsed(currentFiscalYearTimeSplitUtilizations, lesserTime);

	const existingUtilizationForSpace = timeSplitUtilizations.find(
		(ut) => ut.fundingSpaceId === fundingSpace.id
	) || { fullTimeWeeksUsed: 0, partTimeWeeksUsed: 0 }; // these default 0s are only ever used to populate the default value

	const remainingWeeks =
		Math.min(timeSplit.fullTimeWeeks, timeSplit.partTimeWeeks) -
		fiscalYearUsedWeeks -
		(lesserTime === FundingTime.Full
			? existingUtilizationForSpace.fullTimeWeeksUsed
			: existingUtilizationForSpace.partTimeWeeksUsed);

	return (
		<TextInput
			type="inline-input"
			name="splitFundingTimeUtilization"
			id={`${fundingSpace.id}-lesser-weeks-used`}
			label={<span className="text-bold">{labelText}</span>}
			defaultValue={`${
				lesserTime === FundingTime.Full
					? existingUtilizationForSpace.fullTimeWeeksUsed
					: existingUtilizationForSpace.partTimeWeeksUsed
			}`}
			onChange={(e) => {
				const input = e.target.value;
				const lesserWeeksUsed = parseInt(input.replace(/[^0-9.]/g, ''), 10) || 0;

				updateData(
					produce(report, (draft) =>
						set(
							draft,
							dataDriller
								.at('timeSplitUtilizations')
								.find((ut) => ut.fundingSpaceId === fundingSpace.id).path,
							getSplitUtilization(
								timeSplit,
								lesserWeeksUsed,
								reportingPeriodWeeks,
								report.reportingPeriod as ReportingPeriod,
								report
							)
						)
					)
				);
			}}
			status={displayValidationStatus([
				{
					type: 'error',
					response: error || null,
					field: 'timesplitutilizations',
					message: WEEKS_USED_CANNOT_EXCEED_WEEKS_AVAILABLE,
					errorAlertState,
				},
			])}
			disabled={!!report.submittedAt}
			small
			afterContent={
				<>
					of {reportingPeriodWeeks} weeks in {getReportingPeriodMonth(report.reportingPeriod)}.
					<span className="text-italic text-gray-70">
						&nbsp;({remainingWeeks} {prettyFundingTime(lesserTime)} weeks remaining)
					</span>
				</>
			}
		/>
	);
};
