import { SectionProps } from "../../enrollmentTypes";
import idx from "idx";
import { hasValidationErrors } from "../../../../utils/validations";

export const Status = ({enrollment}: SectionProps) => {
	if(idx(enrollment, _ => _.child.foster)) {
		return 'exempt';
	}

	return hasValidationErrors(idx(enrollment, _ => _.child.family) || null, ['determination'])
			? 'incomplete'
			: 'complete'
}
