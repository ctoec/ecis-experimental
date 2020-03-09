import { Family } from '../../generated';
import { InlineIcon } from '../../components';

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
	var street = family.addressLine1 ? family.addressLine1 : '';
	var town = family.town ? family.town : '';
	var state = family.state ? family.state : '';
	var zip = family.zip ? family.zip : '';

	var fullAddress = !street && !town && !state && !zip ? '' : `${street}, ${town}, ${state} ${zip}`;
	if (!street || !town || !state || !zip) {
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
