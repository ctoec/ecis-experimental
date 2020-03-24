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

	const [loading, error, reports] = useApi(
		api => api.apiOrganizationsOrgIdReportsGet(params),
		[user, cacheInvalidator],
		{
			skip: !user,
		}
	);

	const [, , organization] = useApi(
		api =>
			api.apiOrganizationsIdGet({
				id: getIdForUser(user, 'org'),
			}),
		[user],
		{ skip: !user }
	);

	const pendingReportsCount =
		!loading &&
		!error &&
		reports &&
		reports.filter<DeepNonUndefineable<Report>>(
			(r => !r.submittedAt) as (_: DeepNonUndefineable<Report>) => _ is DeepNonUndefineable<Report>
		).length;

	let navItems: NavItemProps[] = [
		{ type: 'secondary', title: 'Privacy policy', path: '/privacy-policy' },
		// { type: 'secondary', title: 'Help', path: '/help' },
	];

	if (user) {
		navItems = navItems.concat([
			{ type: 'primary', title: 'Roster', path: '/roster' },
			{
				type: 'primary',
				title:
					pendingReportsCount && pendingReportsCount > 0
						? `Reports (${pendingReportsCount})`
						: 'Reports',
				path: '/reports',
			},
		]);
	}

	return (
		<div className={cx(styles.container)}>
			<AppProvider value={cacheContext}>
				<a className="usa-skipnav" href="#main-content">
					Skip to main content
				</a>
				<Header
					primaryTitle="ECE Reporter"
					secondaryTitle={(organization && organization.name) || undefined}
					navItems={navItems}
					loginPath="/login"
					logoutPath="/logout"
					userFirstName={(user && user.firstName) || undefined}
				/>
				<main id="main-content">
					<ErrorBoundary>
						<AlertProvider>
							<Switch>
								{routes.map((route, index) => (
									<MakeRouteWithSubRoutes key={index} {...route} />
								))}
							</Switch>
						</AlertProvider>
					</ErrorBoundary>
				</main>
			</AppProvider>
		</div>
	);
};

export default App;
