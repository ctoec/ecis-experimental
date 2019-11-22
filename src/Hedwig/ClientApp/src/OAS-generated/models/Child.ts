// tslint:disable
// eslint-disable
/**
 * Hedwig API test
 * Prototype of REST API for Hedwig client 
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
import {
    Family,
    FamilyFromJSON,
    FamilyFromJSONTyped,
    FamilyToJSON,
    Gender,
    GenderFromJSON,
    GenderFromJSONTyped,
    GenderToJSON,
} from './';

/**
 * 
 * @export
 * @interface Child
 */
export interface Child {
    /**
     * 
     * @type {number}
     * @memberof Child
     */
    id: number;
    /**
     * 
     * @type {string}
     * @memberof Child
     */
    sasid?: string;
    /**
     * 
     * @type {string}
     * @memberof Child
     */
    firstName: string;
    /**
     * 
     * @type {string}
     * @memberof Child
     */
    middleName?: string;
    /**
     * 
     * @type {string}
     * @memberof Child
     */
    lastName: string;
    /**
     * 
     * @type {string}
     * @memberof Child
     */
    suffix?: string;
    /**
     * 
     * @type {string}
     * @memberof Child
     */
    birthdate: string;
    /**
     * 
     * @type {string}
     * @memberof Child
     */
    birthTown?: string;
    /**
     * 
     * @type {string}
     * @memberof Child
     */
    birthState?: string;
    /**
     * 
     * @type {string}
     * @memberof Child
     */
    birthCertificateId?: string;
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
    hispanicOrLatinxEthnicity?: boolean;
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
     * @type {Family}
     * @memberof Child
     */
    family?: Family;
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
        'birthdate': json['birthdate'],
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
        'family': !exists(json, 'family') ? undefined : FamilyFromJSON(json['family']),
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
        'birthdate': value.birthdate,
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
        'family': FamilyToJSON(value.family),
    };
}

