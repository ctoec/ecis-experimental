/* tslint:disable */
/* eslint-disable */
/**
 * Hedwig API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: v1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
import {
    Enrollment,
    EnrollmentFromJSON,
    EnrollmentFromJSONTyped,
    EnrollmentToJSON,
    Family,
    FamilyFromJSON,
    FamilyFromJSONTyped,
    FamilyToJSON,
    Gender,
    GenderFromJSON,
    GenderFromJSONTyped,
    GenderToJSON,
    Organization,
    OrganizationFromJSON,
    OrganizationFromJSONTyped,
    OrganizationToJSON,
    User,
    UserFromJSON,
    UserFromJSONTyped,
    UserToJSON,
    ValidationError,
    ValidationErrorFromJSON,
    ValidationErrorFromJSONTyped,
    ValidationErrorToJSON,
} from './';

/**
 * 
 * @export
 * @interface Child
 */
export interface Child {
    /**
     * 
     * @type {string}
     * @memberof Child
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof Child
     */
    sasid?: string | null;
    /**
     * 
     * @type {string}
     * @memberof Child
     */
    firstName: string | null;
    /**
     * 
     * @type {string}
     * @memberof Child
     */
    middleName?: string | null;
    /**
     * 
     * @type {string}
     * @memberof Child
     */
    lastName: string | null;
    /**
     * 
     * @type {string}
     * @memberof Child
     */
    suffix?: string | null;
    /**
     * 
     * @type {Date}
     * @memberof Child
     */
    birthdate?: Date | null;
    /**
     * 
     * @type {string}
     * @memberof Child
     */
    birthTown?: string | null;
    /**
     * 
     * @type {string}
     * @memberof Child
     */
    birthState?: string | null;
    /**
     * 
     * @type {string}
     * @memberof Child
     */
    birthCertificateId?: string | null;
    /**
     * 
     * @type {boolean}
     * @memberof Child
     */
    americanIndianOrAlaskaNative?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof Child
     */
    asian?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof Child
     */
    blackOrAfricanAmerican?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof Child
     */
    nativeHawaiianOrPacificIslander?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof Child
     */
    white?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof Child
     */
    hispanicOrLatinxEthnicity?: boolean | null;
    /**
     * 
     * @type {Gender}
     * @memberof Child
     */
    gender?: Gender;
    /**
     * 
     * @type {boolean}
     * @memberof Child
     */
    foster?: boolean;
    /**
     * 
     * @type {number}
     * @memberof Child
     */
    familyId?: number | null;
    /**
     * 
     * @type {Family}
     * @memberof Child
     */
    family?: Family;
    /**
     * 
     * @type {Array<Enrollment>}
     * @memberof Child
     */
    enrollments?: Array<Enrollment> | null;
    /**
     * 
     * @type {number}
     * @memberof Child
     */
    organizationId: number;
    /**
     * 
     * @type {Organization}
     * @memberof Child
     */
    organization?: Organization;
    /**
     * 
     * @type {Array<ValidationError>}
     * @memberof Child
     */
    validationErrors?: Array<ValidationError> | null;
    /**
     * 
     * @type {number}
     * @memberof Child
     */
    authorId?: number | null;
    /**
     * 
     * @type {User}
     * @memberof Child
     */
    author?: User;
    /**
     * 
     * @type {Date}
     * @memberof Child
     */
    updatedAt?: Date | null;
}

export function ChildFromJSON(json: any): Child {
    return ChildFromJSONTyped(json, false);
}

export function ChildFromJSONTyped(json: any, ignoreDiscriminator: boolean): Child {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'sasid': !exists(json, 'sasid') ? undefined : json['sasid'],
        'firstName': json['firstName'],
        'middleName': !exists(json, 'middleName') ? undefined : json['middleName'],
        'lastName': json['lastName'],
        'suffix': !exists(json, 'suffix') ? undefined : json['suffix'],
        'birthdate': !exists(json, 'birthdate') ? undefined : (json['birthdate'] === null ? null : new Date(json['birthdate'])),
        'birthTown': !exists(json, 'birthTown') ? undefined : json['birthTown'],
        'birthState': !exists(json, 'birthState') ? undefined : json['birthState'],
        'birthCertificateId': !exists(json, 'birthCertificateId') ? undefined : json['birthCertificateId'],
        'americanIndianOrAlaskaNative': !exists(json, 'americanIndianOrAlaskaNative') ? undefined : json['americanIndianOrAlaskaNative'],
        'asian': !exists(json, 'asian') ? undefined : json['asian'],
        'blackOrAfricanAmerican': !exists(json, 'blackOrAfricanAmerican') ? undefined : json['blackOrAfricanAmerican'],
        'nativeHawaiianOrPacificIslander': !exists(json, 'nativeHawaiianOrPacificIslander') ? undefined : json['nativeHawaiianOrPacificIslander'],
        'white': !exists(json, 'white') ? undefined : json['white'],
        'hispanicOrLatinxEthnicity': !exists(json, 'hispanicOrLatinxEthnicity') ? undefined : json['hispanicOrLatinxEthnicity'],
        'gender': !exists(json, 'gender') ? undefined : GenderFromJSON(json['gender']),
        'foster': !exists(json, 'foster') ? undefined : json['foster'],
        'familyId': !exists(json, 'familyId') ? undefined : json['familyId'],
        'family': !exists(json, 'family') ? undefined : FamilyFromJSON(json['family']),
        'enrollments': !exists(json, 'enrollments') ? undefined : (json['enrollments'] === null ? null : (json['enrollments'] as Array<any>).map(EnrollmentFromJSON)),
        'organizationId': json['organizationId'],
        'organization': !exists(json, 'organization') ? undefined : OrganizationFromJSON(json['organization']),
        'validationErrors': !exists(json, 'validationErrors') ? undefined : (json['validationErrors'] === null ? null : (json['validationErrors'] as Array<any>).map(ValidationErrorFromJSON)),
        'authorId': !exists(json, 'authorId') ? undefined : json['authorId'],
        'author': !exists(json, 'author') ? undefined : UserFromJSON(json['author']),
        'updatedAt': !exists(json, 'updatedAt') ? undefined : (json['updatedAt'] === null ? null : new Date(json['updatedAt'])),
    };
}

export function ChildToJSON(value?: Child | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'sasid': value.sasid,
        'firstName': value.firstName,
        'middleName': value.middleName,
        'lastName': value.lastName,
        'suffix': value.suffix,
        'birthdate': value.birthdate === undefined ? undefined : (value.birthdate === null ? null : value.birthdate.toISOString()),
        'birthTown': value.birthTown,
        'birthState': value.birthState,
        'birthCertificateId': value.birthCertificateId,
        'americanIndianOrAlaskaNative': value.americanIndianOrAlaskaNative,
        'asian': value.asian,
        'blackOrAfricanAmerican': value.blackOrAfricanAmerican,
        'nativeHawaiianOrPacificIslander': value.nativeHawaiianOrPacificIslander,
        'white': value.white,
        'hispanicOrLatinxEthnicity': value.hispanicOrLatinxEthnicity,
        'gender': GenderToJSON(value.gender),
        'foster': value.foster,
        'familyId': value.familyId,
        'family': FamilyToJSON(value.family),
        'enrollments': value.enrollments === undefined ? undefined : (value.enrollments === null ? null : (value.enrollments as Array<any>).map(EnrollmentToJSON)),
        'organizationId': value.organizationId,
        'organization': OrganizationToJSON(value.organization),
        'validationErrors': value.validationErrors === undefined ? undefined : (value.validationErrors === null ? null : (value.validationErrors as Array<any>).map(ValidationErrorToJSON)),
        'authorId': value.authorId,
        'author': UserToJSON(value.author),
        'updatedAt': value.updatedAt === undefined ? undefined : (value.updatedAt === null ? null : value.updatedAt.toISOString()),
    };
}


