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

/**
 * 
 * @export
 * @enum {string}
 */
export enum FundingSource {
    CDC = 'CDC'
}

export function FundingSourceFromJSON(json: any): FundingSource {
    return FundingSourceFromJSONTyped(json, false);
}

export function FundingSourceFromJSONTyped(json: any, ignoreDiscriminator: boolean): FundingSource {
    return json as FundingSource;
}

export function FundingSourceToJSON(value?: FundingSource | null): any {
    return value as any;
}

