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
    Site,
    SiteFromJSON,
    SiteFromJSONTyped,
    SiteToJSON,
    User,
    UserFromJSON,
    UserFromJSONTyped,
    UserToJSON,
} from './';

/**
 * 
 * @export
 * @interface SitePermission
 */
export interface SitePermission {
    /**
     * 
     * @type {number}
     * @memberof SitePermission
     */
    siteId?: number;
    /**
     * 
     * @type {Site}
     * @memberof SitePermission
     */
    site?: Site;
    /**
     * 
     * @type {number}
     * @memberof SitePermission
     */
    id?: number;
    /**
     * 
     * @type {number}
     * @memberof SitePermission
     */
    userId?: number;
    /**
     * 
     * @type {User}
     * @memberof SitePermission
     */
    user?: User;
}

export function SitePermissionFromJSON(json: any): SitePermission {
    return SitePermissionFromJSONTyped(json, false);
}

export function SitePermissionFromJSONTyped(json: any, ignoreDiscriminator: boolean): SitePermission {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'siteId': !exists(json, 'siteId') ? undefined : json['siteId'],
        'site': !exists(json, 'site') ? undefined : SiteFromJSON(json['site']),
        'id': !exists(json, 'id') ? undefined : json['id'],
        'userId': !exists(json, 'userId') ? undefined : json['userId'],
        'user': !exists(json, 'user') ? undefined : UserFromJSON(json['user']),
    };
}

export function SitePermissionToJSON(value?: SitePermission | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'siteId': value.siteId,
        'site': SiteToJSON(value.site),
        'id': value.id,
        'userId': value.userId,
        'user': UserToJSON(value.user),
    };
}


