import React, { createContext } from 'react';
import { DeepNonUndefineable } from '../../utils/types';
import { ReportingPeriod, ApiReportingPeriodSourceGetRequest, FundingSource } from '../../generated';
import useApi from '../../hooks/useApi';

export type ReportingPeriodContextType = { 
	cdcReportingPeriods: DeepNonUndefineable<ReportingPeriod[]>
};

const ReportingPeriodContext = createContext<ReportingPeriodContextType>({
	cdcReportingPeriods: []
});

const { Provider, Consumer } = ReportingPeriodContext;


const ReportingPeriodProvider: React.FC<{}> = ({
	 children
}) => {
	const cdcReportingPeriodParams: ApiReportingPeriodSourceGetRequest = {
		source: FundingSource.CDC
	};

	const [, , cdcReportingPeriods] = useApi<ReportingPeriod[]>(
		(api) => api.apiReportingPeriodSourceGet(cdcReportingPeriodParams)
	);
	
	return (
		<Provider
			value={{
				cdcReportingPeriods
			}}
		>
			{children}
		</Provider>
	)
};

export { ReportingPeriodProvider };
export { Consumer as ReportingPeriodConsumer };
export default ReportingPeriodContext;