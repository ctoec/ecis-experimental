import { SectionProps } from '../../enrollmentTypes';
import { StepStatus } from '../../../../components';
import { hasValidationErrors } from '../../../../utils/validations';

export const Status: (props: SectionProps) => StepStatus = ({ enrollment }) =>
	enrollment &&
	hasValidationErrors(enrollment.child, [
		'birthdate',
		'birthCertificateId',
		'birthtown',
		'birthstate',
		'hispanicOrLatinxEthnicity',
		'americanIndianOrAlaskaNative',
		'asian',
		'blackOrAfricanAmerican',
		'nativeHawaiianOrPacificIslander',
		'white',
		'gender',
	])
		? 'incomplete'
		: 'complete';
