/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum FundingSource {
  CDC = "CDC",
}

export interface CdcReportInput {
  id: number;
  reportingPeriodId: number;
  organizationId: number;
  submittedAt?: OECDateTime | null;
  accredited: boolean;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
