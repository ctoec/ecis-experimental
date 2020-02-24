import React, { useContext } from 'react';
import 'react-dates/initialize';
import { Switch } from 'react-router-dom';
import MakeRouteWithSubRoutes from './MakeRouteWithSubRoutes';
import routes from '../../routes';
import useApi from '../../hooks/useApi';
import { ApiOrganizationsOrgIdReportsGetRequest, CdcReport as Report } from '../../generated';
import { getIdForUser } from '../../utils/models';
import UserContext from '../../contexts/User/UserContext';
import { useCacheInvalidator, AppProvider } from '../../contexts/App/AppContext';
import { AlertProvider } from '../../contexts/Alert/AlertContext';
import { DeepNonUndefineable } from '../../utils/types';
import { ErrorBoundary, Header, NavItemProps } from '../../components';

import cx from 'classnames';
import styles from './App.module.scss';
import { RosterProvider } from '../../contexts/Roster/RosterContext';

/**
 * Main React component container for Hedwig application
 */
const App: React.FC = () => {
	const { user } = useContext(UserContext);
	const cacheContext = useCacheInvalidator();
	const { cacheInvalidator } = cacheContext;

	const params: ApiOrganizationsOrgIdReportsGetRequest = {
		orgId: getIdForUser(user, 'org'),
	};

	const [loading, error, reports] = useApi(api => api.apiOrganizationsOrgIdReportsGet(params), [
		user,
		cacheInvalidator,
	]);

	const pendingReportsCount =
		!loading &&
		!error &&
		reports &&
		reports.filter<DeepNonUndefineable<Report>>(
			(r => !r.submittedAt) as (_: DeepNonUndefineable<Report>) => _ is DeepNonUndefineable<Report>
		).length;

	const navItems: NavItemProps[] = [
		{ type: 'primary', title: 'Program roster', path: '/roster' },
		{
			type: 'primary',
			title:
				pendingReportsCount && pendingReportsCount > 0
					? `Reports (${pendingReportsCount})`
					: 'Reports',
			path: '/reports',
		},
		{ type: 'secondary', title: 'Privacy policy', path: '/privacy-policy' },
		// { type: 'secondary', title: 'Help', path: '/help' },
	];

	return (
		<div className={cx(styles.container)}>
			<AppProvider value={cacheContext}>
				<a className="usa-skipnav" href="#main-content">
					Skip to main content
				</a>
				<Header
					title="ECE Reporter"
					navItems={navItems}
					loginPath="/login"
					logoutPath="/logout"
					userFirstName={(user && user.firstName) || undefined}
				/>
				<main id="main-content">
					<ErrorBoundary>
						<AlertProvider>
							<RosterProvider>
								<Switch>
									{routes.map((route, index) => (
										<MakeRouteWithSubRoutes key={index} {...route} />
									))}
								</Switch>
							</RosterProvider>
						</AlertProvider>
					</ErrorBoundary>
				</main>
			</AppProvider>
		</div>
	);
};

export default App;
