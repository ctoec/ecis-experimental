import React from 'react';
import { Route } from 'react-router-dom';
import { RouteConfig } from '../../routes';

// Derived from: https://www.freecodecamp.org/news/hitchhikers-guide-to-react-router-v4-c98c39892399/

const MakeRouteWithSubRoutes = (route: RouteConfig) => {
	return (
		<Route
			path={route.path}
			exact={route.exact}
			render={props => <route.component {...props} {...route.props} routes={route.routes} />}
		/>
	);
};

export default MakeRouteWithSubRoutes;
