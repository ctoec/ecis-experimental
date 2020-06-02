import { hasValidationErrors } from '../../../../utils/validations';
import idx from 'idx';
import { SectionProps } from '../../enrollmentTypes';
import { StepStatus } from '../../../../components';

export const Status: (props: SectionProps) => StepStatus = ({ enrollment }) =>
	hasValidationErrors(idx(enrollment, (_) => _.child.family) || null, [
		'addressLine1',
		'town',
		'state',
		'zip',
	]) || hasValidationErrors(idx(enrollment, (_) => _.child) || null, ['familyid'])
		? 'incomplete'
		: 'complete';
