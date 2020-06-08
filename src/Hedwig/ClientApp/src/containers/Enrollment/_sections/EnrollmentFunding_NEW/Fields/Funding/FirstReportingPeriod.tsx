import React, { useState, useEffect, useContext } from 'react';
import { Enrollment, ReportingPeriod } from '../../../../../../generated';
import ReportingPeriodContext from '../../../../../../contexts/ReportingPeriod/ReportingPeriodContext';
import FormContext, { useGenericContext } from '../../../../../../components/Form_New/FormContext';
import moment from 'moment';
import FormField from '../../../../../../components/Form_New/FormField';
import { SelectProps, Select } from '../../../../../../components';
import { reportingPeriodFormatter } from '../../../../../../utils/models';

type FirstReportingPeriodFieldProps = {
	initialLoad: boolean | undefined;
	fundingId: number;
};

// WIP-- needs results of report query (do here instead of in higher component b/c we don't want to have to reuse that query--
// Or make report an optional param and call it here if it isn't passed in?  (To cut down on network requests)
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
		if (!reportingPeriods) return;

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
		// This is a stopgap-- should only return last few(see logic above), not all-- slicing is causing infinite render loop b / c of calling set state
	}, [startDate]);

	const firstReportingPeriodId = dataDriller.at('fundings').find((f) => f.id === fundingId).at('firstReportingPeriodId').value;
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
