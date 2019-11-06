/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateFamilyMutation
// ====================================================

export interface CreateFamilyMutation_createFamilyWithChild_determinations {
  __typename: "FamilyDeterminationType";
  id: number;
  numberOfPeople: number;
  income: OECDecimal;
  determined: OECDate;
}

export interface CreateFamilyMutation_createFamilyWithChild {
  __typename: "FamilyType";
  id: number;
  addressLine1: string | null;
  addressLine2: string | null;
  town: string | null;
  state: string | null;
  zip: string | null;
  homelessness: boolean;
  determinations: CreateFamilyMutation_createFamilyWithChild_determinations[];
}

export interface CreateFamilyMutation {
  createFamilyWithChild: CreateFamilyMutation_createFamilyWithChild | null;
}

export interface CreateFamilyMutationVariables {
  addressLine1?: string | null;
  addressLine2?: string | null;
  town?: string | null;
  state?: string | null;
  zip?: string | null;
  homelessness?: boolean | null;
  childId: string;
}
