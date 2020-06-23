import { Enrollment } from '../../../generated';
import { ApiError } from '../../../hooks/useApi';
import { ErrorAlertState } from '../../../hooks/useCatchAllErrorAlert';

export type BatchEditStepProps = {
	enrollment: Enrollment;
	error: ApiError | null;
	errorAlertState: ErrorAlertState;
	onSubmit: (_: Enrollment) => void;
	onSkip: () => void;
};
