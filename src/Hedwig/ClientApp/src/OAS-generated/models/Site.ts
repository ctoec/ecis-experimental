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
    Enrollment,
    EnrollmentFromJSON,
    EnrollmentFromJSONTyped,
    EnrollmentToJSON,
} from './';

/**
 * 
 * @export
 * @interface Site
 */
export interface Site {
    /**
     * 
     * @type {number}
     * @memberof Site
     */
    id: number;
    /**
     * 
     * @type {string}
     * @memberof Site
     */
    name: string;
    /**
     * 
     * @type {Array<Enrollment>}
     * @memberof Site
     */
    enrollments?: Array<Enrollment>;
}

export function SiteFromJSON(json: any): Site {
    return SiteFromJSONTyped(json, false);
}

export function SiteFromJSONTyped(json: any, ignoreDiscriminator: boolean): Site {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'name': json['name'],
        'enrollments': !exists(json, 'enrollments') ? undefined : ((json['enrollments'] as Array<any>).map(EnrollmentFromJSON)),
    };
}

export function SiteToJSON(value?: Site | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'name': value.name,
        'enrollments': value.enrollments === undefined ? undefined : ((value.enrollments as Array<any>).map(EnrollmentToJSON)),
    };
}

