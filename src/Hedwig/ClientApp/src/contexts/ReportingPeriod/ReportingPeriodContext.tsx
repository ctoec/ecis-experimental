import React, { createContext } from 'react';
import {
	ReportingPeriod,
	ApiReportingPeriodsSourceGetRequest,
	FundingSource,
} from '../../generated';
import useApi from '../../hooks/useApi';

export type ReportingPeriodContextType = {
	cdcReportingPeriods: ReportingPeriod[];
};

const ReportingPeriodContext = createContext<ReportingPeriodContextType>({
	cdcReportingPeriods: [],
});

const { Provider, Consumer } = ReportingPeriodContext;

const ReportingPeriodProvider: React.FC<{}> = ({ children }) => {
	const cdcReportingPeriodParams: ApiReportingPeriodsSourceGetRequest = {
		source: FundingSource.CDC,
	};

	const { data: cdcReportingPeriods } = useApi<ReportingPeriod[]>((api) =>
		api.apiReportingPeriodsSourceGet(cdcReportingPeriodParams)
	);

	return (
		<Provider
			value={{
				cdcReportingPeriods: cdcReportingPeriods || [],
			}}
		>
			{children}
		</Provider>
	);
};

export { ReportingPeriodProvider };
export { Consumer as ReportingPeriodConsumer };
export default ReportingPeriodContext;
