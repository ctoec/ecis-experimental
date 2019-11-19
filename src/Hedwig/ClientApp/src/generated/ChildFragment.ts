/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { Gender, Age, FundingSource, FundingTime } from './globalTypes';

// ====================================================
// GraphQL fragment: ChildFragment
// ====================================================

export interface ChildFragment_enrollments_site {
	__typename: 'SiteType';
	id: number;
	name: string;
}

export interface ChildFragment_enrollments_fundings {
	__typename: 'FundingType';
	id: number;
	source: FundingSource;
	time: FundingTime;
}

export interface ChildFragment_enrollments {
	__typename: 'EnrollmentType';
	id: number;
	entry: OECDate | null;
	exit: OECDate | null;
	age: Age | null;
	site: ChildFragment_enrollments_site;
	fundings: ChildFragment_enrollments_fundings[];
}

export interface ChildFragment_family_determinations {
	__typename: 'FamilyDeterminationType';
	id: number;
	numberOfPeople: number;
	income: OECDecimal;
	determined: OECDate;
}

export interface ChildFragment_family {
	__typename: 'FamilyType';
	id: number;
	addressLine1: string | null;
	addressLine2: string | null;
	town: string | null;
	state: string | null;
	zip: string | null;
	homelessness: boolean;
	determinations: ChildFragment_family_determinations[];
}

export interface ChildFragment {
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
	enrollments: ChildFragment_enrollments[];
	family: ChildFragment_family | null;
}
