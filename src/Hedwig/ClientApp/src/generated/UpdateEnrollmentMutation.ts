/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { Age, FundingSource, FundingTime } from './globalTypes';

// ====================================================
// GraphQL mutation operation: UpdateEnrollmentMutation
// ====================================================

export interface UpdateEnrollmentMutation_updateEnrollment_site {
	__typename: 'SiteType';
	id: number;
	name: string;
}

export interface UpdateEnrollmentMutation_updateEnrollment_fundings {
	__typename: 'FundingType';
	id: number;
	source: FundingSource;
	time: FundingTime;
}

export interface UpdateEnrollmentMutation_updateEnrollment {
	__typename: 'EnrollmentType';
	id: number;
	entry: OECDate | null;
	exit: OECDate | null;
	age: Age | null;
	site: UpdateEnrollmentMutation_updateEnrollment_site;
	fundings: UpdateEnrollmentMutation_updateEnrollment_fundings[];
}

export interface UpdateEnrollmentMutation {
	updateEnrollment: UpdateEnrollmentMutation_updateEnrollment | null;
}

export interface UpdateEnrollmentMutationVariables {
	id: number;
	entry?: string | null;
	exit?: string | null;
	age?: Age | null;
}
