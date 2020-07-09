import { Enrollment } from "../../generated";
import { hasValidationErrors } from "../../utils/validations";

export const hasChildInfoSectionErrors = (enrollment: Enrollment) => 	hasValidationErrors(enrollment.child, [
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
	]);

	export const hasFamilyInfoSectionErrors = (enrollment: Enrollment) => hasValidationErrors(enrollment.child?.family, undefined, true);

	export const hasFamilyIncomeSectionErrors = (enrollment: Enrollment) => hasValidationErrors(enrollment.child?.family, ['determinations']);

	export const hasEnrollmentFundingSectionErrors = (enrollment: Enrollment) => 
		hasValidationErrors(enrollment, ['entry']) ||
		hasValidationErrors(enrollment.child, ['c4KCertificateFamilyId', 'c4KCertificates']);


