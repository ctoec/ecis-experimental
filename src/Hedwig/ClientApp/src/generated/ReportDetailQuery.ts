/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { FundingSource } from "./globalTypes";

// ====================================================
// GraphQL query operation: ReportDetailQuery
// ====================================================

export interface ReportDetailQuery_report_organization {
  __typename: "OrganizationType";
  id: number;
  name: string;
}

export interface ReportDetailQuery_report {
  __typename: "CdcReportType";
  id: number;
  type: FundingSource;
  reportingPeriodId: number;
  period: OECDate;
  periodStart: OECDate;
  periodEnd: OECDate;
  submittedAt: OECDate | null;
  accredited: boolean | null;
  organization: ReportDetailQuery_report_organization;
}

export interface ReportDetailQuery {
  report: ReportDetailQuery_report | null;
}

export interface ReportDetailQueryVariables {
  id: string;
}
