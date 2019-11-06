/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ChildFamilyQuery
// ====================================================

export interface ChildFamilyQuery_child_family_determinations {
	__typename: 'FamilyDeterminationType';
	id: number;
	numberOfPeople: number;
	income: OECDecimal;
	determined: OECDate;
}

export interface ChildFamilyQuery_child_family {
	__typename: 'FamilyType';
	id: number;
	addressLine1: string | null;
	addressLine2: string | null;
	town: string | null;
	state: string | null;
	zip: string | null;
	homelessness: boolean;
	determinations: ChildFamilyQuery_child_family_determinations[];
}

export interface ChildFamilyQuery_child {
	__typename: 'ChildType';
	id: string;
	family: ChildFamilyQuery_child_family | null;
}

export interface ChildFamilyQuery {
	child: ChildFamilyQuery_child | null;
}

export interface ChildFamilyQueryVariables {
	id: string;
}
