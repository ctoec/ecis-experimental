import { User } from "../OAS-generated";
import idx from "idx";

export default function getIdForUser(user: User | undefined, idType: string): number {
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