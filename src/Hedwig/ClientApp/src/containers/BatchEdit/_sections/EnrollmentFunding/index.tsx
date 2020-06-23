import React from 'react';
import { EditForm } from './EditForm';
import { StepProps } from '../../../../components';
import { BatchEditStepProps } from '../batchEditTypes';
import { hasValidationErrors } from '../../../../utils/validations';

export default {
	key: 'enrollment-funding',
	name: 'Enrollment and funding',
	status: ({ enrollment }) =>
		hasValidationErrors(enrollment, ['fundings', 'ageGroup', 'entry']) ||
		hasValidationErrors(enrollment.child, ['c4KFamilyCaseNumber', 'c4KCertificates'])
			? 'incomplete'
			: 'complete',
	Summary: () => <></>,
	Form: EditForm,
} as StepProps<BatchEditStepProps>;
