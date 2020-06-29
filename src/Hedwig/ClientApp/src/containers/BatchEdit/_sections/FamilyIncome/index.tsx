import React from 'react';
import { EditForm } from './EditForm';
import { BatchEditStepProps } from '../batchEditTypes';
import { StepProps } from '../../../../components';

export default {
	key: 'family-income',
	name: 'Family income',
	status: () => 'incomplete',
	Summary: () => <></>,
	Form: EditForm,
} as StepProps<BatchEditStepProps>;
