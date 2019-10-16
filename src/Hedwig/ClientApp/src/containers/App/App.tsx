import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { Switch } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { NavItemProps } from '../../components/Header/NavItem';
import MakeRouteWithSubRoutes from './MakeRouteWithSubRoutes';
import routes from '../../routes';
import withLogin, { WithLoginPropsType } from '../../contexts/Login';

const navItems: NavItemProps[] = [
	{ type: 'primary', title: 'Roster', path: '/' },
	{ type: 'primary', title: 'Enroll kids', path: '/enroll' },
	{ type: 'primary', title: 'Reports', path: '/reports' },
	{ type: 'secondary', title: 'Feedback', path: '/feedback' },
	{ type: 'secondary', title: 'Help', path: '/help' },
];

const App: React.FC<WithLoginPropsType> = ({accessToken}) => {
	let { loading, error, data } = useQuery(gql`
		query AppQuery {
			user(id: 1) {
				firstName
			}
		}
	`);

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
				userFirstName={!loading && !error && data.user && data.user.firstName}
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
