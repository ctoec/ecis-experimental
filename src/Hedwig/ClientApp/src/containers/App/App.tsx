import React, { useEffect } from 'react';
import useAuthQuery from '../../hooks/useAuthQuery';
import { gql } from 'apollo-boost';
import { Switch } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { NavItemProps } from '../../components/Header/NavItem';
import MakeRouteWithSubRoutes from './MakeRouteWithSubRoutes';
import routes from '../../routes';
import { AppQuery } from '../../generated/AppQuery';
import withLogin, { WithLoginPropsType } from '../../contexts/Login';
import 'react-dates/initialize';
import useOASClient from '../../hooks/useOASClient';

export const APP_QUERY = gql`
	query AppQuery {
		me {
			firstName
			reports {
				... on CdcReportType {
					id
					submittedAt
				}
			}
		}
	}
`;

const App: React.FC<WithLoginPropsType> = ({ accessToken }) => {
	useOASClient();
	let { loading, error, data, refetch } = useAuthQuery<AppQuery>(APP_QUERY);
	// The <App> component is only loaded once
	// so in order to update the props to <Header>
	// we need to refetch the data on every change
	// of accessToken. This is not needed in other
	// components that will be remounted into the
	// DOM on page navigation.
	useEffect(() => {
		refetch();
	}, [accessToken, refetch]);

	const reportsNeedAttention =
		!loading &&
		!error &&
		data &&
		data.me &&
		data.me.reports.filter(report => !report.submittedAt).length > 0;

	const navItems: NavItemProps[] = [
		{ type: 'primary', title: 'Roster', path: '/roster' },
		{
			type: 'primary',
			title: 'Reports',
			path: '/reports',
			attentionNeeded: !!reportsNeedAttention,
		},
		{ type: 'secondary', title: 'Feedback', path: '/feedback' },
		{ type: 'secondary', title: 'Help', path: '/help' },
	];

	return (
		<div className="App">
			<a className="usa-skipnav" href="#main-content">
				Skip to main content
			</a>
			<Header
				title="Enrollment &amp; Funding"
				navItems={navItems}
				loginPath="/login"
				logoutPath="/logout"
				userFirstName={(!loading && !error && data && data.me && data.me.firstName) || ''}
			/>
			<main id="main-content">
				<Switch>
					{routes.map((route, index) => (
						<MakeRouteWithSubRoutes key={index} {...route} />
					))}
				</Switch>
			</main>
		</div>
	);
};

export default withLogin(App);
