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
	Organization,
	OrganizationFromJSON,
	OrganizationFromJSONTyped,
	OrganizationToJSON,
	Region,
	RegionFromJSON,
	RegionFromJSONTyped,
	RegionToJSON,
} from './';

/**
 *
 * @export
 * @interface Site
 */
export interface Site {
	/**
	 *
	 * @type {number}
	 * @memberof Site
	 */
	id?: number;
	/**
	 *
	 * @type {string}
	 * @memberof Site
	 */
	name: string | null;
	/**
	 *
	 * @type {boolean}
	 * @memberof Site
	 */
	titleI: boolean;
	/**
	 *
	 * @type {Region}
	 * @memberof Site
	 */
	region: Region;
	/**
	 *
	 * @type {number}
	 * @memberof Site
	 */
	organizationId: number;
	/**
	 *
	 * @type {Organization}
	 * @memberof Site
	 */
	organization?: Organization;
	/**
	 *
	 * @type {number}
	 * @memberof Site
	 */
	facilityCode?: number | null;
	/**
	 *
	 * @type {number}
	 * @memberof Site
	 */
	licenseNumber?: number | null;
	/**
	 *
	 * @type {number}
	 * @memberof Site
	 */
	naeycId?: number | null;
	/**
	 *
	 * @type {number}
	 * @memberof Site
	 */
	registryId?: number | null;
	/**
	 *
	 * @type {Array<Enrollment>}
	 * @memberof Site
	 */
	enrollments?: Array<Enrollment> | null;
}

export function SiteFromJSON(json: any): Site {
	return SiteFromJSONTyped(json, false);
}

export function SiteFromJSONTyped(json: any, ignoreDiscriminator: boolean): Site {
	if (json === undefined || json === null) {
		return json;
	}
	return {
		id: !exists(json, 'id') ? undefined : json['id'],
		name: json['name'],
		titleI: json['titleI'],
		region: RegionFromJSON(json['region']),
		organizationId: json['organizationId'],
		organization: !exists(json, 'organization')
			? undefined
			: OrganizationFromJSON(json['organization']),
		facilityCode: !exists(json, 'facilityCode') ? undefined : json['facilityCode'],
		licenseNumber: !exists(json, 'licenseNumber') ? undefined : json['licenseNumber'],
		naeycId: !exists(json, 'naeycId') ? undefined : json['naeycId'],
		registryId: !exists(json, 'registryId') ? undefined : json['registryId'],
		enrollments: !exists(json, 'enrollments')
			? undefined
			: json['enrollments'] === null
			? null
			: (json['enrollments'] as Array<any>).map(EnrollmentFromJSON),
	};
}

export function SiteToJSON(value?: Site | null): any {
	if (value === undefined) {
		return undefined;
	}
	if (value === null) {
		return null;
	}
	return {
		id: value.id,
		name: value.name,
		titleI: value.titleI,
		region: RegionToJSON(value.region),
		organizationId: value.organizationId,
		organization: OrganizationToJSON(value.organization),
		facilityCode: value.facilityCode,
		licenseNumber: value.licenseNumber,
		naeycId: value.naeycId,
		registryId: value.registryId,
		enrollments:
			value.enrollments === undefined
				? undefined
				: value.enrollments === null
				? null
				: (value.enrollments as Array<any>).map(EnrollmentToJSON),
	};
}
