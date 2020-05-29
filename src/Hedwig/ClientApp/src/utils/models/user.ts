import { User } from '../../generated';
import idx from 'idx';

export type IdType = 'org' | 'site';

/**
 * Accepts a User, an IdType, and id to validate that the user
 * has access to the supplied id of idType.
 * @param user User object from which to validate information
 * @param idType 'org' or 'site' id to validate
 * @param id id of the site or org
 */
export function validatePermissions(user: User | null, idType: IdType, id: string | number) {
	if (!user) {
		return false;
	}

	if (typeof id === 'string') {
		id = parseInt(id, 10);
	}

	if (idType === 'org') {
		return (
			(user.orgPermissions || []).map((permission) => permission.organizationId).indexOf(id) >= 0
		);
	}

	if (idType === 'site') {
		return (
			(idx(user, (_) => _.orgPermissions[0].organization.sites) || [])
				.map((site) => site.id)
				.indexOf(id) >= 0
		);
	}
}

/**
 * Accepts a User and an IdType to extract information from a user
 * about the site and org with which the user is associated.
 * @param user User object from which to extract information
 * @param idType 'org' id to extract
 */
export function getIdForUser(user: User | null, idType: 'org'): number {
	if (!user) {
		return 0;
	}

	if (idType === 'org') {
		const orgId = idx(user, (_) => _.orgPermissions[0].organizationId) || 0;
		return orgId;
	}

	return 0;
}
