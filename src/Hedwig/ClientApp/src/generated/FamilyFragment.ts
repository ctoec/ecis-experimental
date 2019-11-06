/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FamilyFragment
// ====================================================

export interface FamilyFragment_determinations {
	__typename: 'FamilyDeterminationType';
	id: number;
	numberOfPeople: number;
	income: OECDecimal;
	determined: OECDate;
}

export interface FamilyFragment {
	__typename: 'FamilyType';
	id: number;
	addressLine1: string | null;
	addressLine2: string | null;
	town: string | null;
	state: string | null;
	zip: string | null;
	homelessness: boolean;
	determinations: FamilyFragment_determinations[];
}
