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
    FundingSource,
    FundingSourceFromJSON,
    FundingSourceFromJSONTyped,
    FundingSourceToJSON,
    FundingTime,
    FundingTimeFromJSON,
    FundingTimeFromJSONTyped,
    FundingTimeToJSON,
    ReportingPeriod,
    ReportingPeriodFromJSON,
    ReportingPeriodFromJSONTyped,
    ReportingPeriodToJSON,
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
 * @interface Funding
 */
export interface Funding {
    /**
     * 
     * @type {number}
     * @memberof Funding
     */
    id: number;
    /**
     * 
     * @type {number}
     * @memberof Funding
     */
    enrollmentId: number;
    /**
     * 
     * @type {Enrollment}
     * @memberof Funding
     */
    enrollment?: Enrollment;
    /**
     * 
     * @type {FundingSource}
     * @memberof Funding
     */
    source?: FundingSource;
    /**
     * 
     * @type {Date}
     * @memberof Funding
     */
    entry?: Date | null;
    /**
     * 
     * @type {Date}
     * @memberof Funding
     */
    exit?: Date | null;
    /**
     * 
     * @type {number}
     * @memberof Funding
     */
    firstReportingPeriodId?: number | null;
    /**
     * 
     * @type {ReportingPeriod}
     * @memberof Funding
     */
    firstReportingPeriod?: ReportingPeriod;
    /**
     * 
     * @type {number}
     * @memberof Funding
     */
    lastReportingPeriodId?: number | null;
    /**
     * 
     * @type {ReportingPeriod}
     * @memberof Funding
     */
    lastReportingPeriod?: ReportingPeriod;
    /**
     * 
     * @type {FundingTime}
     * @memberof Funding
     */
    time?: FundingTime;
    /**
     * 
     * @type {Array<ValidationError>}
     * @memberof Funding
     */
    validationErrors?: Array<ValidationError> | null;
    /**
     * 
     * @type {number}
     * @memberof Funding
     */
    authorId?: number | null;
    /**
     * 
     * @type {User}
     * @memberof Funding
     */
    author?: User;
}

export function FundingFromJSON(json: any): Funding {
    return FundingFromJSONTyped(json, false);
}

export function FundingFromJSONTyped(json: any, ignoreDiscriminator: boolean): Funding {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'enrollmentId': json['enrollmentId'],
        'enrollment': !exists(json, 'enrollment') ? undefined : EnrollmentFromJSON(json['enrollment']),
        'source': !exists(json, 'source') ? undefined : FundingSourceFromJSON(json['source']),
        'entry': !exists(json, 'entry') ? undefined : (json['entry'] === null ? null : new Date(json['entry'])),
        'exit': !exists(json, 'exit') ? undefined : (json['exit'] === null ? null : new Date(json['exit'])),
        'firstReportingPeriodId': !exists(json, 'firstReportingPeriodId') ? undefined : json['firstReportingPeriodId'],
        'firstReportingPeriod': !exists(json, 'firstReportingPeriod') ? undefined : ReportingPeriodFromJSON(json['firstReportingPeriod']),
        'lastReportingPeriodId': !exists(json, 'lastReportingPeriodId') ? undefined : json['lastReportingPeriodId'],
        'lastReportingPeriod': !exists(json, 'lastReportingPeriod') ? undefined : ReportingPeriodFromJSON(json['lastReportingPeriod']),
        'time': !exists(json, 'time') ? undefined : FundingTimeFromJSON(json['time']),
        'validationErrors': !exists(json, 'validationErrors') ? undefined : (json['validationErrors'] === null ? null : (json['validationErrors'] as Array<any>).map(ValidationErrorFromJSON)),
        'authorId': !exists(json, 'authorId') ? undefined : json['authorId'],
        'author': !exists(json, 'author') ? undefined : UserFromJSON(json['author']),
    };
}

export function FundingToJSON(value?: Funding | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'enrollmentId': value.enrollmentId,
        'enrollment': EnrollmentToJSON(value.enrollment),
        'source': FundingSourceToJSON(value.source),
        'entry': value.entry === undefined ? undefined : (value.entry === null ? null : value.entry.toISOString()),
        'exit': value.exit === undefined ? undefined : (value.exit === null ? null : value.exit.toISOString()),
        'firstReportingPeriodId': value.firstReportingPeriodId,
        'firstReportingPeriod': ReportingPeriodToJSON(value.firstReportingPeriod),
        'lastReportingPeriodId': value.lastReportingPeriodId,
        'lastReportingPeriod': ReportingPeriodToJSON(value.lastReportingPeriod),
        'time': FundingTimeToJSON(value.time),
        'validationErrors': value.validationErrors === undefined ? undefined : (value.validationErrors === null ? null : (value.validationErrors as Array<any>).map(ValidationErrorToJSON)),
        'authorId': value.authorId,
        'author': UserToJSON(value.author),
    };
}


