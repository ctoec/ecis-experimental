/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { FundingSource } from "./globalTypes";

// ====================================================
// GraphQL query operation: ReportsQuery
// ====================================================

export interface ReportsQuery_me_reports_organization {
  __typename: "OrganizationType";
  id: number;
  name: string;
}

export interface ReportsQuery_me_reports {
  __typename: "CdcReportType";
  id: number;
  type: FundingSource;
  period: OECDate;
  dueAt: OECDate;
  submittedAt: OECDate | null;
  organization: ReportsQuery_me_reports_organization;
}

export interface ReportsQuery_me {
  __typename: "UserType";
  reports: ReportsQuery_me_reports[];
}

export interface ReportsQuery {
  me: ReportsQuery_me | null;
}
