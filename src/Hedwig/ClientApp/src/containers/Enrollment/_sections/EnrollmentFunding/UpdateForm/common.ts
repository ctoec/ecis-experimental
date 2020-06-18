import { Enrollment } from '../../../../../generated';
import { ApiError } from '../../../../../hooks/useApi';
import { ErrorAlertState } from '../../../../../hooks/useCatchAllErrorAlert';

export type UpdateFormSectionProps = {
	mutatedEnrollment: Enrollment;
	formOnSubmit: (data: Enrollment) => void;
	saveError: ApiError | null;
	errorAlertState: ErrorAlertState;
	forceCloseEditForms: boolean;
};
