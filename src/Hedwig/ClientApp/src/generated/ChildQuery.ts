/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { Gender, Age, FundingSource, FundingTime } from "./globalTypes";

// ====================================================
// GraphQL query operation: ChildQuery
// ====================================================

export interface ChildQuery_child_enrollments_site {
  __typename: "SiteType";
  id: number;
  name: string;
}

export interface ChildQuery_child_enrollments_fundings {
  __typename: "FundingType";
  id: number;
  source: FundingSource;
  time: FundingTime;
}

export interface ChildQuery_child_enrollments {
  __typename: "EnrollmentType";
  id: number;
  entry: OECDate | null;
  exit: OECDate | null;
  age: Age | null;
  site: ChildQuery_child_enrollments_site;
  fundings: ChildQuery_child_enrollments_fundings[];
}

export interface ChildQuery_child_family_determinations {
  __typename: "FamilyDeterminationType";
  id: number;
  numberOfPeople: number;
  income: OECDecimal;
  determined: OECDate;
}

export interface ChildQuery_child_family {
  __typename: "FamilyType";
  id: number;
  addressLine1: string | null;
  addressLine2: string | null;
  town: string | null;
  state: string | null;
  zip: string | null;
  homelessness: boolean;
  determinations: ChildQuery_child_family_determinations[];
}

export interface ChildQuery_child {
  __typename: "ChildType";
  id: string;
  sasid: string | null;
  firstName: string;
  middleName: string | null;
  lastName: string;
  suffix: string | null;
  birthdate: OECDate | null;
  birthTown: string | null;
  birthState: string | null;
  birthCertificateId: string | null;
  americanIndianOrAlaskaNative: boolean;
  asian: boolean;
  blackOrAfricanAmerican: boolean;
  nativeHawaiianOrPacificIslander: boolean;
  white: boolean;
  hispanicOrLatinxEthnicity: boolean;
  gender: Gender | null;
  foster: boolean;
  enrollments: ChildQuery_child_enrollments[];
  family: ChildQuery_child_family | null;
}

export interface ChildQuery {
  child: ChildQuery_child | null;
}

export interface ChildQueryVariables {
  id: string;
}
