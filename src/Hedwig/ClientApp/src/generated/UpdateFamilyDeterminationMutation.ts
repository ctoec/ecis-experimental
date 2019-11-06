/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateFamilyDeterminationMutation
// ====================================================

export interface UpdateFamilyDeterminationMutation_updateFamilyDetermination {
  __typename: "FamilyDeterminationType";
  id: number;
  numberOfPeople: number;
  income: OECDecimal;
  determined: OECDate;
}

export interface UpdateFamilyDeterminationMutation {
  updateFamilyDetermination: UpdateFamilyDeterminationMutation_updateFamilyDetermination | null;
}

export interface UpdateFamilyDeterminationMutationVariables {
  id: number;
  numberOfPeople: number;
  income: OECDecimal;
  determined: string;
}
