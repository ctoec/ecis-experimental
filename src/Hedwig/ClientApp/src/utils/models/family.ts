import { Family } from '../../generated';
import { InlineIcon } from '../../components';
import { DeepNonUndefineable } from '../types';

export function createEmptyFamily(orgId: number, familyId = 0) {
	return {
		id: familyId,
		organizationId: orgId,
		addressLine1: null,
		addressLine2: null,
		town: null,
		state: null,
		zip: null,
		homelessness: false,
	};
}

export function addressFormatter(family?: Family) {
	if (!family) {
		return [''];
	}
	const addressLine1 = family.addressLine1 ? family.addressLine1 : '';
	const addressLine2 = family.addressLine2 ? ` ${family.addressLine2}` : '';
	const town = family.town ? family.town : '';
	const state = family.state ? family.state : '';
	const zip = family.zip ? family.zip : '';

	const fullAddress =
		!addressLine1 && !town && !state && !zip
			? ''
			: `${addressLine1}${addressLine2}, ${town}, ${state} ${zip}`;
	if (!addressLine1 || !town || !state || !zip) {
		return [fullAddress, InlineIcon({ icon: 'incomplete' })];
	}

	return [fullAddress, ''];
}

export function homelessnessText() {
	return 'Family has experienced homelessness or housing insecurity';
}

export function fosterText() {
	return 'Child lives with foster family';
}
