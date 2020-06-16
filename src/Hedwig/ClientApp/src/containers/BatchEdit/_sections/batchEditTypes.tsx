import { Enrollment } from "../../../generated";
import { ApiError } from "../../../hooks/useApi";

export type BatchEditStepProps = {
	enrollment: Enrollment;
	error: ApiError | null;
	onSubmit: (_: Enrollment) => void;
	onSkip: () => void;
};
