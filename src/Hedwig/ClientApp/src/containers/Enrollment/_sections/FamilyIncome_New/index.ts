import Summary from "./Summary";
import { Section } from "../../enrollmentTypes";
import idx from "idx";
import { sectionHasValidationErrors, processValidationError } from "../../../../utils/validations";
import { NewForm } from "./NewForm/NewForm";
import { UpdateForm }  from "./UpdateForm/UpdateForm";

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
	Form: NewForm,
	UpdateForm: UpdateForm,
};

export default FamilyIncome;
