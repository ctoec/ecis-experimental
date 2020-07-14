import React from 'react';
import { EditForm } from './EditForm';
import { StepProps } from '@ctoec/component-library';
import { BatchEditStepProps } from '../batchEditTypes';
import { hasFamilyInfoSectionErrors } from '../../utils';

export default {
	key: 'family-info',
	name: 'Family information',
	status: ({ enrollment }) => (hasFamilyInfoSectionErrors(enrollment) ? 'incomplete' : 'complete'),
	Summary: () => <></>,
	Form: EditForm,
} as StepProps<BatchEditStepProps>;
