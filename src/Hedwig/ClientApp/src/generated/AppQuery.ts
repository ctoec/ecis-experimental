/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AppQuery
// ====================================================

export interface AppQuery_me_reports {
  __typename: "CdcReportType";
  id: number;
  submittedAt: OECDate | null;
}

export interface AppQuery_me {
  __typename: "UserType";
  firstName: string;
  reports: AppQuery_me_reports[];
}

export interface AppQuery {
  me: AppQuery_me | null;
}
