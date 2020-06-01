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
	lastSubmittedReport: CdcReport | undefined
};

export const FirstReportingPeriodField: React.FC<FirstReportingPeriodFieldProps> = ({
	initialLoad,
	fundingId,
	lastSubmittedReport
}) => {
	const { dataDriller } = useGenericContext<Enrollment>(FormContext);
	const { cdcReportingPeriods: reportingPeriods } = useContext(ReportingPeriodContext)
	const [validReportingPeriods, setValidReportingPeriods] = useState<ReportingPeriod[]>([]) 

	const startDate = dataDriller.at('entry').value || moment().toDate();
	useEffect(() => {
		console.log('reporting periods', reportingPeriods);
		if(!reportingPeriods) return;
		// valid reporting periods:
		// - start on or after the enrollment start date
		// - are after the most recent reporting period for which there is a submitted report
		// - are not more than 3 periods in the "future" -- TODO confirm this AC 
		//   (i.e. in May, we will show May, June, and July reporting periods but not August)

		// const validReportingPeriodRangeStart = lastSubmittedReport && lastSubmittedReport.reportingPeriod
		// 	? moment.max([moment(startDate), moment(lastSubmittedReport.reportingPeriod.periodEnd)]).toDate()
		// 	: startDate;

		const validReportingPeriodRangeStart = startDate;

		const thisReportingPeriodIdx = (reportingPeriods as ReportingPeriod[])
			.findIndex(period => moment(period.period).isSame(moment(), 'month'));
		if(thisReportingPeriodIdx === reportingPeriods.length + 1) {
			throw new Error("Problem with reporting period data!");
		}
		const nextNextReportingPeriod = reportingPeriods[thisReportingPeriodIdx + 2];

		const _validReportingPeriods = propertyBetweenDates(
			reportingPeriods,
			period => period.periodEnd as Date,
			validReportingPeriodRangeStart,
			nextNextReportingPeriod.periodEnd	as Date
		);

		console.log('_validreporting periods', _validReportingPeriods);
		setValidReportingPeriods(_validReportingPeriods);
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
