import { Enrollment } from '../../../../generated';
import { hasValidationErrors } from '../../../../utils/validations';
import idx from 'idx';

// TODO: this does not need to be an object
export const getStatus = (enrollment?: Enrollment) =>
	hasValidationErrors(idx(enrollment, _ => _.child.family) || null, [
		'addressLine1',
		'town',
		'state',
		'zip',
	]) || hasValidationErrors(idx(enrollment, _ => _.child) || null, ['familyid'])
		? 'incomplete'
		: 'complete';
