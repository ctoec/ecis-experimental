import { SectionProps } from '../../enrollmentTypes';
import idx from 'idx';
import { hasValidationErrors } from '../../../../utils/validations';

/**
 * Family income section is:
 * - exempt when this enrollment is for a child living with a foster family
 * - incomplete when family.determinations has validation errors
 * - complete otherwise
 */
export const Status = ({ enrollment }: SectionProps) => {
	if (idx(enrollment, (_) => _.child.foster)) {
		return 'exempt';
	}

	return hasValidationErrors(idx(enrollment, (_) => _.child.family) || null, ['determinations'])
		? 'incomplete'
		: 'complete';
};
