import { Organization } from '../generated';
import { group } from 'd3-array';

export default function getFundingSpaceCapacity(
	organization: Organization | undefined,
	opts: { source?: string; age?: string; time?: string }
): number | undefined {
	if (!organization) return;
	if (!organization.fundingSpaces) return;

	let fundingSpaces = organization.fundingSpaces;

	if (opts.source) {
		fundingSpaces = fundingSpaces.filter(fs => fs.source === opts.source);
	}

	if (opts.age) {
		fundingSpaces = fundingSpaces.filter(fs => fs.ageGroup === opts.age);
	}

	if (opts.time) {
		fundingSpaces = fundingSpaces.filter(fs => fs.time === opts.time);
	}

	let capacity = 0;
	fundingSpaces.forEach(fs => {
		if (fs.capacity) capacity += fs.capacity;
	});

	return capacity;
}

export function getFundingMapFromOrg(
	organization: Organization | undefined,
	...keys: string[]
): any {
	if (!organization) return;
	if (!organization.fundingSpaces) return;
	const keyFuncs = keys.map(key => (d: any) => d[key]);
	const mappedVals = group(organization.fundingSpaces, ...keyFuncs);
	return mappedVals;
}
