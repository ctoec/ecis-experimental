import React from 'react';
import { Route } from 'react-router-dom';
import { RouteConfig } from '../../routes';
import NotSignedInRedirect from '../NotSignedInRedirect/NotSignedInRedirect';

// Derived from: https://www.freecodecamp.org/news/hitchhikers-guide-to-react-router-v4-c98c39892399/

const MakeRouteWithSubRoutes = (route: RouteConfig) => {
	return (
		<Route
			path={route.path}
			exact={route.exact}
			render={(props) => {
				const component = <route.component {...props} {...route.props} routes={route.routes} />;
				if (route.unauthorized) {
					return component;
				} else {
					return <NotSignedInRedirect>{component}</NotSignedInRedirect>;
				}
			}}
		/>
	);
};

export default MakeRouteWithSubRoutes;
