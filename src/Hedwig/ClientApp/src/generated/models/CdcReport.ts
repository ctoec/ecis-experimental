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
    Organization,
    OrganizationFromJSON,
    OrganizationFromJSONTyped,
    OrganizationToJSON,
    ReportingPeriod,
    ReportingPeriodFromJSON,
    ReportingPeriodFromJSONTyped,
    ReportingPeriodToJSON,
    ValidationError,
    ValidationErrorFromJSON,
    ValidationErrorFromJSONTyped,
    ValidationErrorToJSON,
} from './';

/**
 * 
 * @export
 * @interface CdcReport
 */
export interface CdcReport {
    /**
     * 
     * @type {boolean}
     * @memberof CdcReport
     */
    accredited: boolean;
    /**
     * 
     * @type {number}
     * @memberof CdcReport
     */
    c4KRevenue?: number;
    /**
     * 
     * @type {boolean}
     * @memberof CdcReport
     */
    retroactiveC4KRevenue?: boolean;
    /**
     * 
     * @type {number}
     * @memberof CdcReport
     */
    familyFeesRevenue: number | null;
    /**
     * 
     * @type {string}
     * @memberof CdcReport
     */
    comment?: string | null;
    /**
     * 
     * @type {number}
     * @memberof CdcReport
     */
    organizationId: number;
    /**
     * 
     * @type {Organization}
     * @memberof CdcReport
     */
    organization?: Organization;
    /**
     * 
     * @type {number}
     * @memberof CdcReport
     */
    id: number;
    /**
     * 
     * @type {FundingSource}
     * @memberof CdcReport
     */
    type?: FundingSource;
    /**
     * 
     * @type {number}
     * @memberof CdcReport
     */
    reportingPeriodId?: number;
    /**
     * 
     * @type {ReportingPeriod}
     * @memberof CdcReport
     */
    reportingPeriod?: ReportingPeriod;
    /**
     * 
     * @type {Date}
     * @memberof CdcReport
     */
    submittedAt?: Date | null;
    /**
     * 
     * @type {Array<Enrollment>}
     * @memberof CdcReport
     */
    enrollments?: Array<Enrollment> | null;
    /**
     * 
     * @type {Array<ValidationError>}
     * @memberof CdcReport
     */
    validationErrors?: Array<ValidationError> | null;
}

export function CdcReportFromJSON(json: any): CdcReport {
    return CdcReportFromJSONTyped(json, false);
}

export function CdcReportFromJSONTyped(json: any, ignoreDiscriminator: boolean): CdcReport {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'accredited': json['accredited'],
        'c4KRevenue': !exists(json, 'c4KRevenue') ? undefined : json['c4KRevenue'],
        'retroactiveC4KRevenue': !exists(json, 'retroactiveC4KRevenue') ? undefined : json['retroactiveC4KRevenue'],
        'familyFeesRevenue': json['familyFeesRevenue'],
        'comment': !exists(json, 'comment') ? undefined : json['comment'],
        'organizationId': json['organizationId'],
        'organization': !exists(json, 'organization') ? undefined : OrganizationFromJSON(json['organization']),
        'id': json['id'],
        'type': !exists(json, 'type') ? undefined : FundingSourceFromJSON(json['type']),
        'reportingPeriodId': !exists(json, 'reportingPeriodId') ? undefined : json['reportingPeriodId'],
        'reportingPeriod': !exists(json, 'reportingPeriod') ? undefined : ReportingPeriodFromJSON(json['reportingPeriod']),
        'submittedAt': !exists(json, 'submittedAt') ? undefined : (json['submittedAt'] === null ? null : new Date(json['submittedAt'])),
        'enrollments': !exists(json, 'enrollments') ? undefined : (json['enrollments'] === null ? null : (json['enrollments'] as Array<any>).map(EnrollmentFromJSON)),
        'validationErrors': !exists(json, 'validationErrors') ? undefined : (json['validationErrors'] === null ? null : (json['validationErrors'] as Array<any>).map(ValidationErrorFromJSON)),
    };
}

export function CdcReportToJSON(value?: CdcReport | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'accredited': value.accredited,
        'c4KRevenue': value.c4KRevenue,
        'retroactiveC4KRevenue': value.retroactiveC4KRevenue,
        'familyFeesRevenue': value.familyFeesRevenue,
        'comment': value.comment,
        'organizationId': value.organizationId,
        'organization': OrganizationToJSON(value.organization),
        'id': value.id,
        'type': FundingSourceToJSON(value.type),
        'reportingPeriodId': value.reportingPeriodId,
        'reportingPeriod': ReportingPeriodToJSON(value.reportingPeriod),
        'submittedAt': value.submittedAt === undefined ? undefined : (value.submittedAt === null ? null : value.submittedAt.toISOString()),
        'enrollments': value.enrollments === undefined ? undefined : (value.enrollments === null ? null : (value.enrollments as Array<any>).map(EnrollmentToJSON)),
        'validationErrors': value.validationErrors === undefined ? undefined : (value.validationErrors === null ? null : (value.validationErrors as Array<any>).map(ValidationErrorToJSON)),
    };
}


