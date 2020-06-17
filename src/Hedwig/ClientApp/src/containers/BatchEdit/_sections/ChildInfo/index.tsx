import React from 'react';
import { EditForm } from './EditForm';
import { StepProps } from '../../../../components';
import { BatchEditStepProps } from '../batchEditTypes';

export default {
	key: 'child-info',
	name: "Child's information",
	status: () => 'incomplete',
	editPath: '',
	Summary: () => <></>,
	Form: EditForm
} as StepProps<BatchEditStepProps>;
