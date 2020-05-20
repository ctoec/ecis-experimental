import { SectionProps } from "../../enrollmentTypes";
import idx from "idx";
import { sectionHasValidationErrors, processValidationError } from "../../../../utils/validations";

export const Status = ({enrollment}: SectionProps) => {
	if(idx(enrollment, _ => _.child.foster)) {
		return 'exempt';
	}

	return (
		sectionHasValidationErrors([idx(enrollment, _ => _.child.family.determinations) || null])
		|| processValidationError('determinations', idx(enrollment, _ => _.child.family.validationErrors))
	) ? 'incomplete'
	: 'complete';
}
