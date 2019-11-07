/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { Gender, Age, FundingSource, FundingTime } from './globalTypes';

// ====================================================
// GraphQL mutation operation: UpdateChildMutation
// ====================================================

export interface UpdateChildMutation_updateChild_enrollments_site {
	__typename: 'SiteType';
	id: number;
	name: string;
}

export interface UpdateChildMutation_updateChild_enrollments_fundings {
	__typename: 'FundingType';
	id: number;
	source: FundingSource;
	time: FundingTime;
}

export interface UpdateChildMutation_updateChild_enrollments {
	__typename: 'EnrollmentType';
	id: number;
	entry: OECDate | null;
	exit: OECDate | null;
	age: Age | null;
	site: UpdateChildMutation_updateChild_enrollments_site;
	fundings: UpdateChildMutation_updateChild_enrollments_fundings[];
}

export interface UpdateChildMutation_updateChild_family_determinations {
	__typename: 'FamilyDeterminationType';
	id: number;
	numberOfPeople: number;
	income: OECDecimal;
	determined: OECDate;
}

export interface UpdateChildMutation_updateChild_family {
	__typename: 'FamilyType';
	id: number;
	addressLine1: string | null;
	addressLine2: string | null;
	town: string | null;
	state: string | null;
	zip: string | null;
	homelessness: boolean;
	determinations: UpdateChildMutation_updateChild_family_determinations[];
}

export interface UpdateChildMutation_updateChild {
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
	enrollments: UpdateChildMutation_updateChild_enrollments[];
	family: UpdateChildMutation_updateChild_family | null;
}

export interface UpdateChildMutation {
	updateChild: UpdateChildMutation_updateChild | null;
}

export interface UpdateChildMutationVariables {
	id: string;
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
}
