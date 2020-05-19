import idx from 'idx';
import { Section } from '../../enrollmentTypes';
import Summary from './Summary';
import EntryForm from './EntryForm';
import UpdateForm from './UpdateForm';
import { hasValidationErrors } from '../../../../utils/validations';

const FamilyIncome: Section = {
	key: 'family-income',
	name: 'Family income determination',
	status: ({ enrollment }) => {
		// family income disclosure not required for children living with foster families
		if (idx(enrollment, _ => _.child.foster)) {
			return 'exempt';
		}

		// section is incomplete if:
		// - section itself has validation errors
		// - family section has validation error for `determinations` field
		return (
			// 	hasValidationErrors(
			// 	idx(enrollment, _ => _.child.family.determinations) || [],
			// 	[''],
			// ) ||
			hasValidationErrors(idx(enrollment, _ => _.child.family) || null, ['determinations'])
				? 'incomplete'
				: 'complete'
		);
	},
	Summary: Summary,
	Form: EntryForm,
	UpdateForm: UpdateForm,
};

export default FamilyIncome;
