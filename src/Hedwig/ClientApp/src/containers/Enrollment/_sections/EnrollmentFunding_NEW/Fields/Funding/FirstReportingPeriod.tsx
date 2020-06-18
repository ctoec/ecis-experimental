import React, { useState, useEffect, useContext } from 'react';
import { Enrollment, ReportingPeriod } from '../../../../../../generated';
import ReportingPeriodContext from '../../../../../../contexts/ReportingPeriod/ReportingPeriodContext';
import FormContext, { useGenericContext } from '../../../../../../components/Form_New/FormContext';
import moment from 'moment';
import FormField from '../../../../../../components/Form_New/FormField';
import { SelectProps, Select } from '../../../../../../components';
import { reportingPeriodFormatter, getIdForUser } from '../../../../../../utils/models';
import { displayValidationStatus } from '../../../../../../utils/validations/displayValidationStatus';
import { REQUIRED_FOR_OEC_REPORTING } from '../../../../../../utils/validations/messageStrings';
import { FundingFormFieldProps } from '../common';
import useApi from '../../../../../../hooks/useApi';
import UserContext from '../../../../../../contexts/User/UserContext';
import { propertyDateSorter } from '../../../../../../utils/dateSorter';

type FirstReportingPeriodFieldProps = Pick<
	FundingFormFieldProps,
	Exclude<keyof FundingFormFieldProps, 'fundingSpaces'>
>;

export const FirstReportingPeriodField: React.FC<FirstReportingPeriodFieldProps> = ({
	fundingId,
	error,
	errorAlertState,
}) => {
	const { dataDriller } = useGenericContext<Enrollment>(FormContext);
	const { cdcReportingPeriods: reportingPeriods } = useContext(ReportingPeriodContext);
	const [validReportingPeriods, setValidReportingPeriods] = useState<ReportingPeriod[]>([]);

	// Get reports
	const { user } = useContext(UserContext);
	const { data: reports } = useApi((api) =>
		api.apiOrganizationsOrgIdReportsGet({ orgId: getIdForUser(user, 'org') })
	);
	// Get most recently submitted report to use to bound valid reporting period options
	const [mostRecentlySubmittedReport] = (reports || [])
		.filter((report) => !!report.submittedAt)
		.sort((a, b) => propertyDateSorter(a, b, (r) => r.submittedAt, true));

	const startDate = dataDriller.at('entry').value;
	useEffect(() => {
		if (!reportingPeriods) return;

		// valid reporting periods:
		// - start on or after the enrollment start date
		// - are after the most recent reporting period for which there is a submitted report
		// - are not more than 3 periods in the "future" -- TODO confirm this AC
		//   (i.e. in May, we will show May, June, and July reporting periods but not August)
		const validPeriodStartDate = mostRecentlySubmittedReport
			? moment.max(moment.utc(mostRecentlySubmittedReport.reportingPeriod.periodEnd), moment.utc(startDate))
			: moment.utc(startDate);
		const startIdx = reportingPeriods.findIndex((period) =>
			moment.utc(period.period).isSame(moment.utc(validPeriodStartDate), 'month')
		);
		const endIdx =
			reportingPeriods.findIndex((period) => moment.utc(period.period).isSame(moment.utc(), 'month')) + 2;

		const _validReportingPeriods = reportingPeriods.slice(startIdx, endIdx);
		setValidReportingPeriods(_validReportingPeriods);
	}, [startDate]);

	return (
		<FormField<Enrollment, SelectProps, number | null>
			getValue={(data) =>
				data
					.at('fundings')
					.find((f) => f.id === fundingId)
					.at('firstReportingPeriodId')
			}
			parseOnChangeEvent={(e) => parseInt((e.target as HTMLInputElement).value)}
			inputComponent={Select}
			id={`first-reporting-period-${fundingId}`}
			label="First reporting period"
			options={validReportingPeriods.map((period) => ({
				text: reportingPeriodFormatter(period),
				value: `${period.id}`,
			}))}
			status={(_) =>
				displayValidationStatus([
					{
						type: 'error',
						response: error,
						field: 'fundings.firstReportingPeriodId',
						message: REQUIRED_FOR_OEC_REPORTING,
						errorAlertState,
					},
				])
			}
		/>
	);
};
