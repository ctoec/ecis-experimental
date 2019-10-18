/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { CdcReportInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: ReportUpdateMut
// ====================================================

export interface ReportUpdateMut_updatedCdcReport {
  __typename: "CdcReportType";
  id: number;
  submittedAt: OECDate | null;
}

export interface ReportUpdateMut {
  updatedCdcReport: ReportUpdateMut_updatedCdcReport | null;
}

export interface ReportUpdateMutVariables {
  reportInput: CdcReportInput;
}
