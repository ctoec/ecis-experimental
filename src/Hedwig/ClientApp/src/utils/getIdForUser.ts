import { User } from "../generated";
import idx from "idx";

export type IdType = 'org' | 'site';

/**
 * Accepts a User and an IdType to extract information from a user
 * about the site and org with which the user is associated.
 * 
 * @param user User object from which to extract information
 * @param idType 'org' or 'site' id to extract
 */
export default function getIdForUser(user: User | undefined, idType: IdType): number {
    if(idType === 'org') {
        const orgId = idx(user, _ => _.orgPermissions[0].organizationId) || 0;
        return orgId;
    }

    if(idType === 'site') {
        const siteId = idx(user, _ => _.orgPermissions[0].organization.sites[0].id) || 0;
        return siteId;
    }

    return 0;
}