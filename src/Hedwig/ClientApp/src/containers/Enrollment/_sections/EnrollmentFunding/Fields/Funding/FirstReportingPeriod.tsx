import React, { useState, useEffect, useContext } from 'react';
import { CdcReport, Enrollment, ReportingPeriod } from '../../../../../../generated';
import ReportingPeriodContext from '../../../../../../contexts/ReportingPeriod/ReportingPeriodContext';
import FormContext, { useGenericContext } from '../../../../../../components/Form_New/FormContext';
import moment from 'moment';
import { propertyDateSorter } from '../../../../../../utils/dateSorter';
import { propertyBetweenDates } from '../../../../../../utils/dateFilter';

export const FirstReportingPeriodField: React.FC<{initialLoad: boolean, id: number, lastSubmittedReport?: CdcReport}> = ({
	initialLoad,
	id,
	lastSubmittedReport
}) => {
	const { dataDriller } = useGenericContext<Enrollment>(FormContext);
	const { cdcReportingPeriods: reportingPeriods } = useContext(ReportingPeriodContext)
	const [validReportingPeriods, setValidReportingPeriods] = useState<ReportingPeriod[]>([]) 

	const startDate = dataDriller.at('entry').value || moment().toDate();
	useEffect(() => {
		// valid reporting periods:
		// - start on or after the enrollment start date
		// - are after the most recent reporting period for which there is a submitted report
		// - are not more than 3 periods in the "future"
		//   (i.e. in May, we will show May, June, and July reporting periods but not August)

		const validReportingPeriodRangeStart = lastSubmittedReport ? 
			moment.max([startDate, lastSubmittedReport.reportingPeriod.periodEnd]);

		const thisReportingPeriodIdx = (reportingPeriods as ReportingPeriod[])
			.findIndex(period => moment(period.period).isSame(moment(), 'month'));
		if(thisReportingPeriodIdx === reportingPeriods.length + 1) {
			throw new Error("Problem with reporting period data!");
		}
		const nextNextReportingPeriod = reportingPeriods[thisReportingPeriodIdx + 2];

		const _validReportingPeriods = propertyBetweenDates(
			reportingPeriods,
			period => period.periodEnd as Date,
			startDate,
			nextNextReportingPeriod.periodStart	as Date
		);

		if(lastSubmittedReport) {

		}


	}, [dataDriller, lastSubmittedReport])

}
