import React from 'react';

import EnrollmentNew from './containers/Enrollment/New/EnrollmentNew';
import EnrollmentDetail from './containers/Enrollment/Detail/EnrollmentDetail';
import EnrollmentEdit from './containers/Enrollment/Edit/EnrollmentEdit';
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
	props?: any;
};

export const routes: RouteConfig[] = [
	{
		path: '/',
		exact: true,
		component: Roster,
	},
	{
		path: '/roster',
		exact: true,
		component: Roster,
	},
	{
		path: '/roster/sites/:id',
		exact: true,
		component: Roster,
	},
	{
		path: '/roster/sites/:siteId/enroll',
		component: EnrollmentNew,
	},
	{
		path: '/roster/enrollments/:enrollmentId',
		exact: true,
		component: EnrollmentDetail,
	},
	{
		path: '/roster/enrollments/:enrollmentId/new/:sectionId',
		component: EnrollmentNew,
	},
	{
		path: '/roster/enrollments/:enrollmentId/edit/:sectionId',
		component: EnrollmentEdit,
	},
	{
		path: '/reports',
		exact: true,
		component: Reports,
	},
	{
		path: '/reports/:id',
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
