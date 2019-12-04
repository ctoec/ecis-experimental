// tslint:disable
// eslint-disable
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
    FundingSource,
    FundingSourceFromJSON,
    FundingSourceFromJSONTyped,
    FundingSourceToJSON,
} from './';

/**
 * 
 * @export
 * @interface ReportingPeriod
 */
export interface ReportingPeriod {
    /**
     * 
     * @type {number}
     * @memberof ReportingPeriod
     */
    id?: number;
    /**
     * 
     * @type {FundingSource}
     * @memberof ReportingPeriod
     */
    type?: FundingSource;
    /**
     * 
     * @type {Date}
     * @memberof ReportingPeriod
     */
    period?: Date;
    /**
     * 
     * @type {Date}
     * @memberof ReportingPeriod
     */
    periodStart?: Date;
    /**
     * 
     * @type {Date}
     * @memberof ReportingPeriod
     */
    periodEnd?: Date;
    /**
     * 
     * @type {Date}
     * @memberof ReportingPeriod
     */
    dueAt?: Date;
}

export function ReportingPeriodFromJSON(json: any): ReportingPeriod {
    return ReportingPeriodFromJSONTyped(json, false);
}

export function ReportingPeriodFromJSONTyped(json: any, ignoreDiscriminator: boolean): ReportingPeriod {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'type': !exists(json, 'type') ? undefined : FundingSourceFromJSON(json['type']),
        'period': !exists(json, 'period') ? undefined : (new Date(json['period'])),
        'periodStart': !exists(json, 'periodStart') ? undefined : (new Date(json['periodStart'])),
        'periodEnd': !exists(json, 'periodEnd') ? undefined : (new Date(json['periodEnd'])),
        'dueAt': !exists(json, 'dueAt') ? undefined : (new Date(json['dueAt'])),
    };
}

export function ReportingPeriodToJSON(value?: ReportingPeriod | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'type': FundingSourceToJSON(value.type),
        'period': value.period === undefined ? undefined : (value.period.toISOString()),
        'periodStart': value.periodStart === undefined ? undefined : (value.periodStart.toISOString()),
        'periodEnd': value.periodEnd === undefined ? undefined : (value.periodEnd.toISOString()),
        'dueAt': value.dueAt === undefined ? undefined : (value.dueAt.toISOString()),
    };
}

