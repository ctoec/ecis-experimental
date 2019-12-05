import React, { useEffect, useContext } from 'react';
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
import useApi from '../../hooks/useApi';
import { ApiOrganizationsOrgIdReportsGetRequest } from '../../OAS-generated';
import UserContext from '../../contexts/User/UserContext';
import idx from 'idx';
import { useState } from '@storybook/addons';
import getIdForUser from '../../utils/getIdForUser';

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
	const { user } = useContext(UserContext);
	
	const params: ApiOrganizationsOrgIdReportsGetRequest = {
		orgId: getIdForUser(user, "org")
	}

	const [loading, error, reports, mutate] = useApi(
		api => api.apiOrganizationsOrgIdReportsGet(params),
	);

	// To force Reports header data to be updated when user context is populated,
	// we must use the useEffect hook here (because this component is only loaded once).
	useEffect(() => {
		console.log('USE EFFECT');
		mutate(api => api.apiOrganizationsOrgIdReportsGet(params), (_, result) => result);
		console.log(reports);
	},[user]);

	const reportsNeedAttention = 
		!loading &&
		!error &&
		reports &&
		reports.filter(r => !r.submittedAt).length > 0;

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
				userFirstName={user && user.firstName || undefined}
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
