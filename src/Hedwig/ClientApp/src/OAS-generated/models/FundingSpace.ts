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
    Age,
    AgeFromJSON,
    AgeFromJSONTyped,
    AgeToJSON,
    FundingSource,
    FundingSourceFromJSON,
    FundingSourceFromJSONTyped,
    FundingSourceToJSON,
    FundingTime,
    FundingTimeFromJSON,
    FundingTimeFromJSONTyped,
    FundingTimeToJSON,
    Organization,
    OrganizationFromJSON,
    OrganizationFromJSONTyped,
    OrganizationToJSON,
} from './';

/**
 * 
 * @export
 * @interface FundingSpace
 */
export interface FundingSpace {
    /**
     * 
     * @type {number}
     * @memberof FundingSpace
     */
    id?: number;
    /**
     * 
     * @type {number}
     * @memberof FundingSpace
     */
    capacity?: number;
    /**
     * 
     * @type {number}
     * @memberof FundingSpace
     */
    organizationId?: number;
    /**
     * 
     * @type {Organization}
     * @memberof FundingSpace
     */
    organization?: Organization;
    /**
     * 
     * @type {FundingSource}
     * @memberof FundingSpace
     */
    source?: FundingSource;
    /**
     * 
     * @type {FundingTime}
     * @memberof FundingSpace
     */
    time?: FundingTime;
    /**
     * 
     * @type {Age}
     * @memberof FundingSpace
     */
    ageGroup?: Age;
}

export function FundingSpaceFromJSON(json: any): FundingSpace {
    return FundingSpaceFromJSONTyped(json, false);
}

export function FundingSpaceFromJSONTyped(json: any, ignoreDiscriminator: boolean): FundingSpace {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'capacity': !exists(json, 'capacity') ? undefined : json['capacity'],
        'organizationId': !exists(json, 'organizationId') ? undefined : json['organizationId'],
        'organization': !exists(json, 'organization') ? undefined : OrganizationFromJSON(json['organization']),
        'source': !exists(json, 'source') ? undefined : FundingSourceFromJSON(json['source']),
        'time': !exists(json, 'time') ? undefined : FundingTimeFromJSON(json['time']),
        'ageGroup': !exists(json, 'ageGroup') ? undefined : AgeFromJSON(json['ageGroup']),
    };
}

export function FundingSpaceToJSON(value?: FundingSpace | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'capacity': value.capacity,
        'organizationId': value.organizationId,
        'organization': OrganizationToJSON(value.organization),
        'source': FundingSourceToJSON(value.source),
        'time': FundingTimeToJSON(value.time),
        'ageGroup': AgeToJSON(value.ageGroup),
    };
}


