/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { Age, FundingSource, FundingTime } from './globalTypes';

// ====================================================
// GraphQL query operation: RosterQuery
// ====================================================

export interface RosterQuery_me_sites_enrollments_child {
	__typename: 'ChildType';
	id: string;
	firstName: string;
	middleName: string | null;
	lastName: string;
	birthdate: OECDate | null;
	suffix: string | null;
}

export interface RosterQuery_me_sites_enrollments_fundings {
	__typename: 'FundingType';
	source: FundingSource;
	time: FundingTime;
}

export interface RosterQuery_me_sites_enrollments {
	__typename: 'EnrollmentType';
	id: number;
	entry: OECDate | null;
	exit: OECDate | null;
	age: Age | null;
	child: RosterQuery_me_sites_enrollments_child;
	fundings: RosterQuery_me_sites_enrollments_fundings[];
}

export interface RosterQuery_me_sites {
  __typename: "SiteType";
  id: number;
  name: string;
  enrollments: RosterQuery_me_sites_enrollments[];
}

export interface RosterQuery_me {
  __typename: "UserType";
  sites: RosterQuery_me_sites[];
}

export interface RosterQuery {
  me: RosterQuery_me | null;
}

export interface RosterQueryVariables {
  from?: OECDate | null;
  to?: OECDate | null;
}
