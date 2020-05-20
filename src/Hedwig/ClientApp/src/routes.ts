import React from 'react';
import EnrollmentNew from './containers/Enrollment/New/EnrollmentNew';
import EnrollmentDetail from './containers/Enrollment/Detail/EnrollmentDetail';
import EnrollmentEdit from './containers/Enrollment/Edit/EnrollmentEdit';
import Feedback from './containers/Feedback/Feedback';
import Help from './containers/Help/Help';
import Login from './containers/Login/Login';
import PageNotFound from './containers/PageNotFound/PageNotFound';
import PrivacyPolicy from './containers/PrivacyPolicy/PrivacyPolicy';
import Roster from './containers/Roster/Roster';
import ReportsSummary from './containers/Reports/ReportsSummary/ReportsSummary';
import ReportDetail from './containers/Reports/ReportDetail/ReportDetail';
import Withdrawal from './containers/Withdrawal/Withdrawal';
import Home from './containers/Home/Home';

export type RouteConfig = {
	path: string;
	component: React.FC<any>;
	exact?: boolean;
	routes?: RouteConfig[];
	unauthorized?: boolean;
	props?: any;
};

export const routes: RouteConfig[] = [
	{
		path: '/',
		exact: true,
		component: Home,
		unauthorized: true,
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
		path: '/roster/sites/:siteId/enrollments/:enrollmentId',
		exact: true,
		component: EnrollmentDetail,
	},
	{
		path: '/roster/sites/:siteId/enrollments/:enrollmentId/new/:sectionId',
		component: EnrollmentNew,
	},
	{
		path: '/roster/sites/:siteId/enrollments/:enrollmentId/edit/:sectionId',
		component: EnrollmentEdit,
	},
	{
		path: '/roster/sites/:siteId/enrollments/:enrollmentId/withdraw',
		component: Withdrawal,
	},
	{
		path: '/reports',
		exact: true,
		component: ReportsSummary,
	},
	{
		path: '/reports/:id',
		exact: true,
		component: ReportDetail,
	},
	{
		path: '/feedback',
		component: Feedback,
		unauthorized: true,
	},
	{
		path: '/help',
		component: Help,
		unauthorized: true,
	},
	{
		path: '/privacy-policy',
		component: PrivacyPolicy,
		unauthorized: true,
	},
	{
		path: '/login',
		component: Login,
		unauthorized: true,
	},
	{
		path: '/logout',
		component: Login,
		unauthorized: true,
	},
	{
		path: '/:unknown',
		component: PageNotFound,
		unauthorized: true,
	},
];

export default routes;
