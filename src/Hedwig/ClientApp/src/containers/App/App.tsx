import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { Switch } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { NavItemProps } from '../../components/Header/NavItem';
import MakeRouteWithSubRoutes from './MakeRouteWithSubRoutes';
import routes from '../../routes';
import { AppQuery } from '../../generated/AppQuery';
import withLogin, { WithLoginPropsType } from '../../contexts/Login';

export default function App(): React.FC<WithLoginPropsType> = ({accessToken}) => {
	const { loading, error, data } = useQuery<AppQuery>(gql`
		query AppQuery {
			user(id: 1) {
				firstName
				reports {
					... on CdcReportType {
						id
						submittedAt
					}
				}
			}
		}
	`);

	const reportsNeedAttention =
		!loading &&
		!error &&
		data &&
		data.user &&
		data.user.reports.filter(report => !report.submittedAt).length > 0;

	const navItems: NavItemProps[] = [
		{ type: 'primary', title: 'Roster', path: '/' },
		{ type: 'primary', title: 'Enroll kids', path: '/enroll' },
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
				userFirstName={(!loading && !error && data && data.user && data.user.firstName) || ''}
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
}

export default withLogin(App);
