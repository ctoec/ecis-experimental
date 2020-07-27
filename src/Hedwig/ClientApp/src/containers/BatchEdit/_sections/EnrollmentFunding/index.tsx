import React from 'react';
import { EditForm } from './EditForm';
import { StepProps } from '@ctoec/component-library';
import { BatchEditStepProps } from '../batchEditTypes';
import { hasEnrollmentFundingSectionErrors } from '../../utils';

export default {
	key: 'enrollment-funding',
	name: 'Enrollment and funding',
	status: ({ enrollment }) =>
		hasEnrollmentFundingSectionErrors(enrollment) ? 'incomplete' : 'complete',
	Summary: () => <></>,
	Form: EditForm,
} as StepProps<BatchEditStepProps>;
