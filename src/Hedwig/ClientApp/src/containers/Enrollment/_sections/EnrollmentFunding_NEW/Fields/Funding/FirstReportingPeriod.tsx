import React, { useState, useEffect, useContext } from 'react';
import { CdcReport, Enrollment, ReportingPeriod } from '../../../../../../generated';
import ReportingPeriodContext from '../../../../../../contexts/ReportingPeriod/ReportingPeriodContext';
import FormContext, { useGenericContext } from '../../../../../../components/Form_New/FormContext';
import moment from 'moment';
import { propertyBetweenDates } from '../../../../../../utils/dateFilter';
import FormField from '../../../../../../components/Form_New/FormField';
import { SelectProps, Select } from '../../../../../../components';
import { FundingFormFieldProps } from '../common';
import { reportingPeriodFormatter } from '../../../../../../utils/models';

type FirstReportingPeriodFieldProps = {
	initialLoad: boolean | undefined;
	fundingId: number;
};

export const FirstReportingPeriodField: React.FC<FirstReportingPeriodFieldProps> = ({
	initialLoad,
	fundingId,
}) => {
	const { dataDriller } = useGenericContext<Enrollment>(FormContext);
	const { cdcReportingPeriods: reportingPeriods } = useContext(ReportingPeriodContext)
	const [validReportingPeriods, setValidReportingPeriods] = useState<ReportingPeriod[]>([]) 

	// TODO: Get report!!!!!! 

	const startDate = dataDriller.at('entry').value || moment().toDate();
	useEffect(() => {
		if(!reportingPeriods) return;

		// valid reporting periods:
		// - start on or after the enrollment start date
		// - are after the most recent reporting period for which there is a submitted report
		// - are not more than 3 periods in the "future" -- TODO confirm this AC 
		//   (i.e. in May, we will show May, June, and July reporting periods but not August)

		// TODO correctly use report
		// const validPeriodStartDate = report ? moment.max(moment(report.reportingPeriod.periodEnd), moment(startDate)) : moment(startDate);
		const startIdx = reportingPeriods
			.findIndex(period => moment(period.period).isSame(moment(startDate), 'month'));
		const endIdx = reportingPeriods
			.findIndex(period => moment(period.period).isSame(moment(), 'month')) + 2;

		const _validReportingPeriods = reportingPeriods.slice(startIdx, endIdx);	
		// TODO Why does this cause infinite loop??????????????
		// setValidReportingPeriods(_validReportingPeriods);
		setValidReportingPeriods(reportingPeriods);
	}, [startDate]);

	return (
		<FormField<Enrollment, SelectProps, number | null>
			getValue={data => data.at('fundings').find(f => f.id === fundingId).at('firstReportingPeriodId')}
			parseOnChangeEvent={e => parseInt((e.target as HTMLInputElement).value)}
			inputComponent={Select}
			id={`first-reporting-period-${fundingId}`}
			label="First reporting period"
			options={
				validReportingPeriods.map(period => ({
					text: reportingPeriodFormatter(period),
					value: `${period.id}`
				}))
			}
		/>
	)
}
