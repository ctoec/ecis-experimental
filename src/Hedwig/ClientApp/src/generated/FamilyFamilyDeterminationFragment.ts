/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FamilyFamilyDeterminationFragment
// ====================================================

export interface FamilyFamilyDeterminationFragment_determinations {
	__typename: 'FamilyDeterminationType';
	id: number;
	numberOfPeople: number;
	income: OECDecimal;
	determined: OECDate;
}

export interface FamilyFamilyDeterminationFragment {
	__typename: 'FamilyType';
	id: number;
	determinations: FamilyFamilyDeterminationFragment_determinations[];
}
