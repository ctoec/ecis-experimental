import React from 'react';

import Enroll from './containers/Enroll/Enroll';
import Feedback from './containers/Feedback/Feedback';
import Help from './containers/Help/Help';
import PageNotFound from './containers/PageNotFound/PageNotFound';
import Reports from './containers/Reports/Reports';
import Roster from './containers/Roster/Roster';

export type RouteConfig = {
	path: string;
	component: React.FC<any>;
	exact?: boolean;
	routes?: RouteConfig[];
};

export const routes: RouteConfig[] = [
	{
		path: '/',
		component: Roster,
		exact: true,
	},
	{
		path: '/roster',
		component: Roster,
	},
	{
		path: '/enroll',
		component: Enroll,
	},
	{
		path: '/reports',
		component: Reports,
	},
	{
		path: '/feedback',
		component: Feedback,
	},
	{
		path: '/help',
		component: Help,
	},
	{
		path: '/:unknown',
		component: PageNotFound,
	},
];

export default routes;
