/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateFamilyMutation
// ====================================================

export interface UpdateFamilyMutation_updateFamily_determinations {
	__typename: 'FamilyDeterminationType';
	id: number;
	numberOfPeople: number;
	income: OECDecimal;
	determined: OECDate;
}

export interface UpdateFamilyMutation_updateFamily {
	__typename: 'FamilyType';
	id: number;
	addressLine1: string | null;
	addressLine2: string | null;
	town: string | null;
	state: string | null;
	zip: string | null;
	homelessness: boolean;
	determinations: UpdateFamilyMutation_updateFamily_determinations[];
}

export interface UpdateFamilyMutation {
	updateFamily: UpdateFamilyMutation_updateFamily | null;
}

export interface UpdateFamilyMutationVariables {
	id: number;
	addressLine1?: string | null;
	addressLine2?: string | null;
	town?: string | null;
	state?: string | null;
	zip?: string | null;
	homelessness?: boolean | null;
}
