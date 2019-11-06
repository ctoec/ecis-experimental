/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { Gender, Age, FundingSource, FundingTime } from './globalTypes';

// ====================================================
// GraphQL mutation operation: CreateChildMutation
// ====================================================

export interface CreateChildMutation_createChildWithSiteEnrollment_enrollments_site {
	__typename: 'SiteType';
	id: number;
	name: string;
}

export interface CreateChildMutation_createChildWithSiteEnrollment_enrollments_fundings {
	__typename: 'FundingType';
	id: number;
	source: FundingSource;
	time: FundingTime;
}

export interface CreateChildMutation_createChildWithSiteEnrollment_enrollments {
	__typename: 'EnrollmentType';
	id: number;
	entry: OECDate | null;
	exit: OECDate | null;
	age: Age | null;
	site: CreateChildMutation_createChildWithSiteEnrollment_enrollments_site;
	fundings: CreateChildMutation_createChildWithSiteEnrollment_enrollments_fundings[];
}

export interface CreateChildMutation_createChildWithSiteEnrollment_family_determinations {
	__typename: 'FamilyDeterminationType';
	id: number;
	numberOfPeople: number;
	income: OECDecimal;
	determined: OECDate;
}

export interface CreateChildMutation_createChildWithSiteEnrollment_family {
	__typename: 'FamilyType';
	id: number;
	addressLine1: string | null;
	addressLine2: string | null;
	town: string | null;
	state: string | null;
	zip: string | null;
	homelessness: boolean;
	determinations: CreateChildMutation_createChildWithSiteEnrollment_family_determinations[];
}

export interface CreateChildMutation_createChildWithSiteEnrollment {
	__typename: 'ChildType';
	id: string;
	sasid: string | null;
	firstName: string;
	middleName: string | null;
	lastName: string;
	suffix: string | null;
	birthdate: OECDate | null;
	birthTown: string | null;
	birthState: string | null;
	birthCertificateId: string | null;
	americanIndianOrAlaskaNative: boolean;
	asian: boolean;
	blackOrAfricanAmerican: boolean;
	nativeHawaiianOrPacificIslander: boolean;
	white: boolean;
	hispanicOrLatinxEthnicity: boolean;
	gender: Gender | null;
	foster: boolean;
	enrollments: CreateChildMutation_createChildWithSiteEnrollment_enrollments[];
	family: CreateChildMutation_createChildWithSiteEnrollment_family | null;
}

export interface CreateChildMutation {
	createChildWithSiteEnrollment: CreateChildMutation_createChildWithSiteEnrollment | null;
}

export interface CreateChildMutationVariables {
	sasid?: string | null;
	firstName: string;
	middleName?: string | null;
	lastName: string;
	suffix?: string | null;
	birthdate?: string | null;
	birthCertificateId?: string | null;
	birthTown?: string | null;
	birthState?: string | null;
	gender?: Gender | null;
	americanIndianOrAlaskaNative?: boolean | null;
	asian?: boolean | null;
	blackOrAfricanAmerican?: boolean | null;
	nativeHawaiianOrPacificIslander?: boolean | null;
	white?: boolean | null;
	hispanicOrLatinxEthnicity?: boolean | null;
	foster?: boolean | null;
	siteId: number;
}
