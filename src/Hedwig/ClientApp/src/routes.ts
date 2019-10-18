import React from 'react';

import Enroll from './containers/Enroll/Enroll';
import Feedback from './containers/Feedback/Feedback';
import Help from './containers/Help/Help';
import Login from './containers/Login/Login';
import PageNotFound from './containers/PageNotFound/PageNotFound';
import Reports from './containers/Reports/Reports';
import Roster from './containers/Roster/Roster';
import ReportDetail from './containers/ReportDetail/ReportDetail';

export type RouteConfig = {
	path: string;
	component: React.FC<any>;
	exact?: boolean;
	routes?: RouteConfig[];
	props?: any
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
		exact: true,
		component: Reports
	},
	{
		path: '/reports/:id',
		exact: false, 
		component: ReportDetail,
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
		path: '/login',
		component: Login,
	},
	{
		path: '/:unknown',
		component: PageNotFound,
	},
];

export default routes;
