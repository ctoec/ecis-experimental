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

/**
 * 
 * @export
 * @enum {string}
 */
export enum FundingSource {
    CDC = 'CDC',
    C4K = 'C4K'
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

