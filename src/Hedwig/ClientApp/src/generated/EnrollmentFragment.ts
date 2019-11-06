/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { Age, FundingSource, FundingTime } from './globalTypes';

// ====================================================
// GraphQL fragment: EnrollmentFragment
// ====================================================

export interface EnrollmentFragment_site {
	__typename: 'SiteType';
	id: number;
	name: string;
}

export interface EnrollmentFragment_fundings {
	__typename: 'FundingType';
	id: number;
	source: FundingSource;
	time: FundingTime;
}

export interface EnrollmentFragment {
	__typename: 'EnrollmentType';
	id: number;
	entry: OECDate | null;
	exit: OECDate | null;
	age: Age | null;
	site: EnrollmentFragment_site;
	fundings: EnrollmentFragment_fundings[];
}
