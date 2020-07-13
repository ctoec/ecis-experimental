import React from 'react';
import { EditForm } from './EditForm';
import { StepProps, InlineIcon } from '../../../../components';
import { BatchEditStepProps } from '../batchEditTypes';
import { hasChildInfoSectionErrors } from '../../utils';

export default {
	key: 'child-info',
	name: 'Child information',
	status: ({ enrollment }) => (hasChildInfoSectionErrors(enrollment) ? 'incomplete' : 'complete'),
	Summary: ({ enrollment }) =>
		hasChildInfoSectionErrors(enrollment) ? (
			<>
				<InlineIcon icon="incomplete" />
				Child Info
			</>
		) : (
			<>
				<InlineIcon icon="complete" />
				Child Info
			</>
		),
	Form: EditForm,
} as StepProps<BatchEditStepProps>;
