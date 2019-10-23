/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { FundingSource } from "./globalTypes";

// ====================================================
// GraphQL query operation: ReportQuery
// ====================================================

export interface ReportQuery_report_organization {
  __typename: "OrganizationType";
  id: number;
  name: string;
}

export interface ReportQuery_report {
  __typename: "CdcReportType";
  id: number;
  type: FundingSource;
  period: OECDate;
  periodStart: OECDate;
  periodEnd: OECDate;
  submittedAt: OECDate | null;
  accredited: boolean;
  organization: ReportQuery_report_organization;
}

export interface ReportQuery {
  report: ReportQuery_report | null;
}

export interface ReportQueryVariables {
  id: string;
}
