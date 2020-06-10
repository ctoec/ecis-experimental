import { Enrollment } from '../../../../../generated';
import { ApiError } from '../../../../../hooks/useApi';

export type UpdateFormSectionProps = {
	mutatedEnrollment: Enrollment;
	formOnSubmit: (data: Enrollment) => void;
	saveError: ApiError | null;
	forceCloseEditForms: boolean;
};
