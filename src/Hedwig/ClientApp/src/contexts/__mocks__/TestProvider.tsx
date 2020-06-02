import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory, History } from 'history';
import AuthenticationContext from '../Authentication/AuthenticationContext';
import UserContext from '../User/UserContext';
import ReportingPeriodContext from '../ReportingPeriod/ReportingPeriodContext';
import { User, ReportingPeriod } from '../../generated';
import { cdcReportingPeriods as _cdcReportingPeriods, user as _user } from '../../tests/data';

type TestProviderProps = {
	user?: User;
	cdcReportingPeriods?: ReportingPeriod[];
	history?: History<any>;
};

const TestProvider: React.FC<TestProviderProps> = ({
	children,
	user = _user,
	cdcReportingPeriods = _cdcReportingPeriods,
	history = createMemoryHistory(),
}) => {
	return (
		<AuthenticationContext.Provider
			value={{ accessToken: '', withFreshToken: jest.fn(), loading: false }}
		>
			<UserContext.Provider value={{ user, loading: false }}>
				<ReportingPeriodContext.Provider value={{ cdcReportingPeriods }}>
					<Router history={history}>{children}</Router>
				</ReportingPeriodContext.Provider>
			</UserContext.Provider>
		</AuthenticationContext.Provider>
	);
};

export default TestProvider;
