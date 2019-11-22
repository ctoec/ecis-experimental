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
    Report,
    ReportFromJSON,
    ReportFromJSONTyped,
    ReportToJSON,
} from './';

/**
 * 
 * @export
 * @interface User
 */
export interface User {
    /**
     * 
     * @type {number}
     * @memberof User
     */
    id: number;
    /**
     * 
     * @type {string}
     * @memberof User
     */
    firstName: string;
    /**
     * 
     * @type {string}
     * @memberof User
     */
    middleName?: string;
    /**
     * 
     * @type {string}
     * @memberof User
     */
    lastName: string;
    /**
     * 
     * @type {string}
     * @memberof User
     */
    suffix?: string;
    /**
     * 
     * @type {Array<Report>}
     * @memberof User
     */
    reports?: Array<Report>;
}

export function UserFromJSON(json: any): User {
    return UserFromJSONTyped(json, false);
}

export function UserFromJSONTyped(json: any, ignoreDiscriminator: boolean): User {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'firstName': json['firstName'],
        'middleName': !exists(json, 'middleName') ? undefined : json['middleName'],
        'lastName': json['lastName'],
        'suffix': !exists(json, 'suffix') ? undefined : json['suffix'],
        'reports': !exists(json, 'reports') ? undefined : ((json['reports'] as Array<any>).map(ReportFromJSON)),
    };
}

export function UserToJSON(value?: User | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'firstName': value.firstName,
        'middleName': value.middleName,
        'lastName': value.lastName,
        'suffix': value.suffix,
        'reports': value.reports === undefined ? undefined : ((value.reports as Array<any>).map(ReportToJSON)),
    };
}

