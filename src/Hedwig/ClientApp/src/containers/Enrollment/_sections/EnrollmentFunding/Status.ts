import { SectionProps } from "../../enrollmentTypes";
import { StepStatus } from "../../../../components";
import { hasValidationErrors } from "../../../../utils/validations";

export const Status: (props: SectionProps) => StepStatus = ({enrollment}) => 
		enrollment &&
		(hasValidationErrors(enrollment, ['fundings', 'ageGroup', 'entry']) ||
			hasValidationErrors(enrollment.child, ['c4KFamilyCaseNumber', 'c4KCertificates']))
			? 'incomplete'
			: 'complete';
