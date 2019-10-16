/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AppQuery
// ====================================================

export interface AppQuery_user_reports {
	__typename: 'CdcReportType';
	id: number;
	submittedAt: OECDate | null;
}

export interface AppQuery_user {
	__typename: 'UserType';
	firstName: string;
	reports: AppQuery_user_reports[];
}

export interface AppQuery {
	user: AppQuery_user | null;
}
