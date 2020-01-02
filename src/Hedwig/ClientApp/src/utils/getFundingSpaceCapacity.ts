import { Organization } from '../generated';

export default function getFundingSpaceCapacity(
	organization: Organization | undefined,
	opts: { source?: string; ageGroup?: string; time?: string }
): number {
	if (!organization) return 0;
	if (!organization.fundingSpaces) return 0;

	let fundingSpaces = organization.fundingSpaces;

	if (opts.source) {
		fundingSpaces = fundingSpaces.filter(fs => fs.source === opts.source);
	}

	if (opts.ageGroup) {
		fundingSpaces = fundingSpaces.filter(fs => fs.ageGroup === opts.ageGroup);
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
