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
    OrganizationPermission,
    OrganizationPermissionFromJSON,
    OrganizationPermissionFromJSONTyped,
    OrganizationPermissionToJSON,
    Site,
    SiteFromJSON,
    SiteFromJSONTyped,
    SiteToJSON,
    SitePermission,
    SitePermissionFromJSON,
    SitePermissionFromJSONTyped,
    SitePermissionToJSON,
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
    wingedKeysId: string;
    /**
     * 
     * @type {string}
     * @memberof User
     */
    firstName: string | null;
    /**
     * 
     * @type {string}
     * @memberof User
     */
    middleName?: string | null;
    /**
     * 
     * @type {string}
     * @memberof User
     */
    lastName: string | null;
    /**
     * 
     * @type {string}
     * @memberof User
     */
    suffix?: string | null;
    /**
     * 
     * @type {Array<OrganizationPermission>}
     * @memberof User
     */
    orgPermissions?: Array<OrganizationPermission> | null;
    /**
     * 
     * @type {Array<SitePermission>}
     * @memberof User
     */
    sitePermissions?: Array<SitePermission> | null;
    /**
     * 
     * @type {Array<Site>}
     * @memberof User
     */
    sites?: Array<Site> | null;
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
        'wingedKeysId': json['wingedKeysId'],
        'firstName': json['firstName'],
        'middleName': !exists(json, 'middleName') ? undefined : json['middleName'],
        'lastName': json['lastName'],
        'suffix': !exists(json, 'suffix') ? undefined : json['suffix'],
        'orgPermissions': !exists(json, 'orgPermissions') ? undefined : (json['orgPermissions'] === null ? null : (json['orgPermissions'] as Array<any>).map(OrganizationPermissionFromJSON)),
        'sitePermissions': !exists(json, 'sitePermissions') ? undefined : (json['sitePermissions'] === null ? null : (json['sitePermissions'] as Array<any>).map(SitePermissionFromJSON)),
        'sites': !exists(json, 'sites') ? undefined : (json['sites'] === null ? null : (json['sites'] as Array<any>).map(SiteFromJSON)),
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
        'wingedKeysId': value.wingedKeysId,
        'firstName': value.firstName,
        'middleName': value.middleName,
        'lastName': value.lastName,
        'suffix': value.suffix,
        'orgPermissions': value.orgPermissions === undefined ? undefined : (value.orgPermissions === null ? null : (value.orgPermissions as Array<any>).map(OrganizationPermissionToJSON)),
        'sitePermissions': value.sitePermissions === undefined ? undefined : (value.sitePermissions === null ? null : (value.sitePermissions as Array<any>).map(SitePermissionToJSON)),
        'sites': value.sites === undefined ? undefined : (value.sites === null ? null : (value.sites as Array<any>).map(SiteToJSON)),
    };
}


