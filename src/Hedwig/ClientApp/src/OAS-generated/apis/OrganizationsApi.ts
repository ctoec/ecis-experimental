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


import * as runtime from '../runtime';

export interface ApiOrganizationsIdGetRequest {
    id: number;
    include?: Array<string>;
}

/**
 * no description
 */
export class OrganizationsApi extends runtime.BaseAPI {

    /**
     */
    async apiOrganizationsGetRaw(): Promise<runtime.ApiResponse<string>> {
        const queryParameters: runtime.HTTPQuery = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/Organizations`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     */
    async apiOrganizationsGet(): Promise<string> {
        const response = await this.apiOrganizationsGetRaw();
        return await response.value();
    }

    /**
     */
    async apiOrganizationsIdGetRaw(requestParameters: ApiOrganizationsIdGetRequest): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling apiOrganizationsIdGet.');
        }

        const queryParameters: runtime.HTTPQuery = {};

        if (requestParameters.include) {
            queryParameters['include[]'] = requestParameters.include;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/Organizations/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.VoidApiResponse(response);
    }

    /**
     */
    async apiOrganizationsIdGet(requestParameters: ApiOrganizationsIdGetRequest): Promise<void> {
        await this.apiOrganizationsIdGetRaw(requestParameters);
    }

}
