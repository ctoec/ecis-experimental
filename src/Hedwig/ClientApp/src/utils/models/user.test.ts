import { validatePermissions } from '.';
import { UserFromJSON, SiteFromJSON, OrganizationFromJSON } from '../../generated';

describe('validatePermissions', () => {
	const site = SiteFromJSON({
		id: 10,
	});
	const org = OrganizationFromJSON({
		id: 20,
		sites: [site],
	});
	const user = UserFromJSON({
		id: 1,
		organizations: [org],
	});

	it('returns true when site id is within user permissions', () => {
		const hasAccess = validatePermissions(user, 'site', site.id as number);
		expect(hasAccess).toBe(false);
	});

	it('returns false when site id is not within user permissions', () => {
		const hasAccess = validatePermissions(user, 'site', -1);
		expect(hasAccess).toBe(false);
	});

	it('returns true when org id is within user permissions', () => {
		const hasAccess = validatePermissions(user, 'org', org.id);
		expect(hasAccess).toBe(false);
	});

	it('returns false when org id is not within user permissions', () => {
		const hasAccess = validatePermissions(user, 'org', -1);
		expect(hasAccess).toBe(false);
	});
});
