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
    familyFeesRevenue?: number;
    /**
     * 
     * @type {number}
     * @memberof CdcReport
     */
    organizationId?: number;
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
    id?: number;
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
<<<<<<< HEAD
    submittedAt?: Date | null;
=======
    submittedAt?: Date;
    /**
     * 
     * @type {Array<ValidationError>}
     * @memberof CdcReport
     */
    validationErrors?: Array<ValidationError> | null;
>>>>>>> Implement all validateable models, and regenerate client code
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
        'familyFeesRevenue': !exists(json, 'familyFeesRevenue') ? undefined : json['familyFeesRevenue'],
        'organizationId': !exists(json, 'organizationId') ? undefined : json['organizationId'],
        'organization': !exists(json, 'organization') ? undefined : OrganizationFromJSON(json['organization']),
        'id': !exists(json, 'id') ? undefined : json['id'],
        'type': !exists(json, 'type') ? undefined : FundingSourceFromJSON(json['type']),
        'reportingPeriodId': !exists(json, 'reportingPeriodId') ? undefined : json['reportingPeriodId'],
        'reportingPeriod': !exists(json, 'reportingPeriod') ? undefined : ReportingPeriodFromJSON(json['reportingPeriod']),
<<<<<<< HEAD
        'submittedAt': !exists(json, 'submittedAt') ? undefined : (json['submittedAt'] === null ? null : new Date(json['submittedAt'])),
=======
        'submittedAt': !exists(json, 'submittedAt') ? undefined : (new Date(json['submittedAt'])),
        'validationErrors': !exists(json, 'validationErrors') ? undefined : (json['validationErrors'] === null ? null : (json['validationErrors'] as Array<any>).map(ValidationErrorFromJSON)),
>>>>>>> Implement all validateable models, and regenerate client code
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
        'organizationId': value.organizationId,
        'organization': OrganizationToJSON(value.organization),
        'id': value.id,
        'type': FundingSourceToJSON(value.type),
        'reportingPeriodId': value.reportingPeriodId,
        'reportingPeriod': ReportingPeriodToJSON(value.reportingPeriod),
<<<<<<< HEAD
        'submittedAt': value.submittedAt === undefined ? undefined : (value.submittedAt === null ? null : value.submittedAt.toISOString()),
=======
        'submittedAt': value.submittedAt === undefined ? undefined : (value.submittedAt.toISOString()),
        'validationErrors': value.validationErrors === undefined ? undefined : (value.validationErrors === null ? null : (value.validationErrors as Array<any>).map(ValidationErrorToJSON)),
>>>>>>> Implement all validateable models, and regenerate client code
    };
}


