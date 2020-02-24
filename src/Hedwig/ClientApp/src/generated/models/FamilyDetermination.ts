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
	Family,
	FamilyFromJSON,
	FamilyFromJSONTyped,
	FamilyToJSON,
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
 * @interface FamilyDetermination
 */
export interface FamilyDetermination {
	/**
	 *
	 * @type {number}
	 * @memberof FamilyDetermination
	 */
	id: number;
	/**
	 *
	 * @type {boolean}
	 * @memberof FamilyDetermination
	 */
	notDisclosed?: boolean;
	/**
	 *
	 * @type {number}
	 * @memberof FamilyDetermination
	 */
	numberOfPeople?: number | null;
	/**
	 *
	 * @type {number}
	 * @memberof FamilyDetermination
	 */
	income?: number | null;
	/**
	 *
	 * @type {Date}
	 * @memberof FamilyDetermination
	 */
	determinationDate?: Date | null;
	/**
	 *
	 * @type {number}
	 * @memberof FamilyDetermination
	 */
	familyId: number;
	/**
	 *
	 * @type {Family}
	 * @memberof FamilyDetermination
	 */
	family?: Family;
	/**
	 *
	 * @type {Array<ValidationError>}
	 * @memberof FamilyDetermination
	 */
	validationErrors?: Array<ValidationError> | null;
	/**
	 *
	 * @type {number}
	 * @memberof FamilyDetermination
	 */
	authorId?: number | null;
	/**
	 *
	 * @type {User}
	 * @memberof FamilyDetermination
	 */
	author?: User;
	/**
	 *
	 * @type {Date}
	 * @memberof FamilyDetermination
	 */
	updatedAt?: Date | null;
}

export function FamilyDeterminationFromJSON(json: any): FamilyDetermination {
	return FamilyDeterminationFromJSONTyped(json, false);
}

export function FamilyDeterminationFromJSONTyped(
	json: any,
	ignoreDiscriminator: boolean
): FamilyDetermination {
	if (json === undefined || json === null) {
		return json;
	}
	return {
		id: json['id'],
		notDisclosed: !exists(json, 'notDisclosed') ? undefined : json['notDisclosed'],
		numberOfPeople: !exists(json, 'numberOfPeople') ? undefined : json['numberOfPeople'],
		income: !exists(json, 'income') ? undefined : json['income'],
		determinationDate: !exists(json, 'determinationDate')
			? undefined
			: json['determinationDate'] === null
			? null
			: new Date(json['determinationDate']),
		familyId: json['familyId'],
		family: !exists(json, 'family') ? undefined : FamilyFromJSON(json['family']),
		validationErrors: !exists(json, 'validationErrors')
			? undefined
			: json['validationErrors'] === null
			? null
			: (json['validationErrors'] as Array<any>).map(ValidationErrorFromJSON),
		authorId: !exists(json, 'authorId') ? undefined : json['authorId'],
		author: !exists(json, 'author') ? undefined : UserFromJSON(json['author']),
		updatedAt: !exists(json, 'updatedAt')
			? undefined
			: json['updatedAt'] === null
			? null
			: new Date(json['updatedAt']),
	};
}

export function FamilyDeterminationToJSON(value?: FamilyDetermination | null): any {
	if (value === undefined) {
		return undefined;
	}
	if (value === null) {
		return null;
	}
	return {
		id: value.id,
		notDisclosed: value.notDisclosed,
		numberOfPeople: value.numberOfPeople,
		income: value.income,
		determinationDate:
			value.determinationDate === undefined
				? undefined
				: value.determinationDate === null
				? null
				: value.determinationDate.toISOString(),
		familyId: value.familyId,
		family: FamilyToJSON(value.family),
		validationErrors:
			value.validationErrors === undefined
				? undefined
				: value.validationErrors === null
				? null
				: (value.validationErrors as Array<any>).map(ValidationErrorToJSON),
		authorId: value.authorId,
		author: UserToJSON(value.author),
		updatedAt:
			value.updatedAt === undefined
				? undefined
				: value.updatedAt === null
				? null
				: value.updatedAt.toISOString(),
	};
}
