/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { FundingSource } from './globalTypes';

// ====================================================
// GraphQL query operation: RosterQuery
// ====================================================

export interface RosterQuery_user_sites_enrollments_child_family_determinations {
	__typename: 'FamilyDeterminationType';
	determined: OECDate;
}

export interface RosterQuery_user_sites_enrollments_child_family {
	__typename: 'FamilyType';
	determinations: RosterQuery_user_sites_enrollments_child_family_determinations[];
}

export interface RosterQuery_user_sites_enrollments_child {
	__typename: 'ChildType';
	firstName: string;
	middleName: string | null;
	lastName: string;
	birthdate: OECDate;
	suffix: string | null;
	family: RosterQuery_user_sites_enrollments_child_family | null;
}

export interface RosterQuery_user_sites_enrollments_fundings {
	__typename: 'FundingType';
	entry: OECDate;
	exit: OECDate | null;
	source: FundingSource;
}

export interface RosterQuery_user_sites_enrollments {
	__typename: 'EnrollmentType';
	id: number;
	entry: OECDate;
	exit: OECDate | null;
	child: RosterQuery_user_sites_enrollments_child;
	fundings: RosterQuery_user_sites_enrollments_fundings[];
}

export interface RosterQuery_user_sites {
	__typename: 'SiteType';
	id: number;
	name: string;
	enrollments: RosterQuery_user_sites_enrollments[];
}

export interface RosterQuery_user {
	__typename: 'UserType';
	sites: RosterQuery_user_sites[];
}

export interface RosterQuery {
	user: RosterQuery_user | null;
}
