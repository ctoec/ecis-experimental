import React from 'react';
import { EditForm } from './EditForm';
import { StepProps } from '../../../../components';
import { BatchEditStepProps } from '../batchEditTypes';

export default {
	key: 'family-info',
	name: "Family information",
	status: () => 'incomplete',
	editPath: '',
	Summary: () => <></>,
	Form: EditForm
} as StepProps<BatchEditStepProps>;
