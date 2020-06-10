import React from 'react';
import { Enrollment } from '../../../../../generated';
import { ApiError } from '../../../../../hooks/useApi';

export type UpdateFormSectionProps = {
	mutatedEnrollment: Enrollment;
	setMutatedEnrollment: React.Dispatch<React.SetStateAction<Enrollment>>;
	setAttemptingSave: React.Dispatch<React.SetStateAction<boolean>>;
	saveError: ApiError | null;
	forceCloseEditForms: boolean;
}
