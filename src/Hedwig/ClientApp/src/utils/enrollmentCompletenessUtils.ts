import { Enrollment } from '../generated/models/Enrollment';
import { DeepNonUndefineable } from '../utils/types';

// Note: These explicit is(In)CompleteEnrollment functions is necessary due to Typescript limitations
export function isIncompleteEnrollment(
	enrollment: DeepNonUndefineable<Enrollment>
): enrollment is DeepNonUndefineable<Enrollment> {
	return !enrollment.ageGroup || !enrollment.entry;
}

export function isCompleteEnrollment(
	enrollment: DeepNonUndefineable<Enrollment>
): enrollment is DeepNonUndefineable<Enrollment> {
	return !isIncompleteEnrollment(enrollment);
}

export function isAgeIncomplete(
	enrollment: DeepNonUndefineable<Enrollment>
): enrollment is DeepNonUndefineable<Enrollment> {
	return !enrollment.ageGroup;
}
