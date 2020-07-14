import React from 'react';
import { EditForm } from './EditForm';
import { BatchEditStepProps } from '../batchEditTypes';
import { StepProps } from '@ctoec/component-library';
import { hasFamilyIncomeSectionErrors } from '../../utils';

export default {
	key: 'family-income',
	name: 'Family income',
	status: ({ enrollment }) =>
		hasFamilyIncomeSectionErrors(enrollment) ? 'incomplete' : 'complete',
	Summary: () => <></>,
	Form: EditForm,
} as StepProps<BatchEditStepProps>;
