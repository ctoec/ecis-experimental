/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ChildQuery
// ====================================================

export interface ChildQuery_child_family {
	__typename: 'FamilyType';
	id: number;
	caseNumber: number | null;
}

export interface ChildQuery_child {
	__typename: 'ChildType';
	id: string;
	firstName: string;
	middleName: string | null;
	lastName: string;
	suffix: string | null;
	family: ChildQuery_child_family | null;
}

export interface ChildQuery {
	child: ChildQuery_child | null;
}

export interface ChildQueryVariables {
	id: string;
}
