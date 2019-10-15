/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { FundingSource } from './globalTypes';

// ====================================================
// GraphQL query operation: ReportsQuery
// ====================================================

export interface ReportsQuery_user_reports_organization {
	__typename: 'OrganizationType';
	id: number;
	name: string;
}

export interface ReportsQuery_user_reports {
	__typename: 'CdcReportType';
	id: number;
	type: FundingSource;
	period: OECDate;
	dueAt: OECDate;
	submittedAt: OECDate | null;
	organization: ReportsQuery_user_reports_organization;
}

export interface ReportsQuery_user {
	__typename: 'UserType';
	reports: ReportsQuery_user_reports[];
}

export interface ReportsQuery {
	user: ReportsQuery_user | null;
}
