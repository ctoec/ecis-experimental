import idx from 'idx';
import { Section } from '../../enrollmentTypes';
import { sectionHasValidationErrors, processValidationError } from '../../../../utils/validations';
import Summary from './Summary';
import EntryForm from './EntryForm';
import UpdateForm from './UpdateForm';

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
		return sectionHasValidationErrors([
			idx(enrollment, _ => _.child.family.determinations) || null,
		]) ||
			processValidationError(
				'determinations',
				idx(enrollment, _ => _.child.family.validationErrors) || null
			)
			? 'incomplete'
			: 'complete';
	},
	Summary: Summary,
	Form: EntryForm,
	UpdateForm: UpdateForm,
};

export default FamilyIncome;
