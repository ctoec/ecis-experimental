/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ChildFamilyFragment
// ====================================================

export interface ChildFamilyFragment_family_determinations {
	__typename: 'FamilyDeterminationType';
	id: number;
	numberOfPeople: number;
	income: OECDecimal;
	determined: OECDate;
}

export interface ChildFamilyFragment_family {
	__typename: 'FamilyType';
	id: number;
	addressLine1: string | null;
	addressLine2: string | null;
	town: string | null;
	state: string | null;
	zip: string | null;
	homelessness: boolean;
	determinations: ChildFamilyFragment_family_determinations[];
}

export interface ChildFamilyFragment {
	__typename: 'ChildType';
	id: string;
	family: ChildFamilyFragment_family | null;
}
