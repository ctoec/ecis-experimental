/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ReportSubmitMutation
// ====================================================

export interface ReportSubmitMutation_submitCdcReport {
  __typename: "CdcReportType";
  id: number;
  submittedAt: OECDate | null;
}

export interface ReportSubmitMutation {
  submitCdcReport: ReportSubmitMutation_submitCdcReport | null;
}

export interface ReportSubmitMutationVariables {
  id: number;
  accredited: boolean;
}
