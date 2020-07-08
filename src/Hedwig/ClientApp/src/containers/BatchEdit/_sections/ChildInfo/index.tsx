import React from 'react';
import { EditForm } from './EditForm';
import { StepProps } from '../../../../components';
import { BatchEditStepProps } from '../batchEditTypes';
import { hasChildInfoSectionErrors } from '../../utils';

export default {
	key: 'child-info',
	name: "Child's information",
	status: ({ enrollment }) =>
		hasChildInfoSectionErrors(enrollment) ? 'incomplete' : 'complete',
	Summary: () => <></>,
	Form: EditForm,
} as StepProps<BatchEditStepProps>;
