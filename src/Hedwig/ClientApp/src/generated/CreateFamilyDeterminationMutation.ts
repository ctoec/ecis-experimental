/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateFamilyDeterminationMutation
// ====================================================

export interface CreateFamilyDeterminationMutation_createFamilyDetermination {
	__typename: 'FamilyDeterminationType';
	id: number;
	numberOfPeople: number;
	income: OECDecimal;
	determined: OECDate;
}

export interface CreateFamilyDeterminationMutation {
	createFamilyDetermination: CreateFamilyDeterminationMutation_createFamilyDetermination | null;
}

export interface CreateFamilyDeterminationMutationVariables {
	familyId: number;
	numberOfPeople: number;
	income: OECDecimal;
	determined: string;
}
