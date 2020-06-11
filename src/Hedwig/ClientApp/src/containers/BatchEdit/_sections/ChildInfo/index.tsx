import React from 'react';
import { Section, SectionProps } from '../../../Enrollment/enrollmentTypes';
import { hasValidationErrors } from '../../../../utils/validations';
import { EditForm } from './Form';

export default {
	key: 'child-information',
	name: 'Child information',
	status: ({enrollment}: SectionProps) => {
		return enrollment && hasValidationErrors(enrollment, undefined, true)
			? 'incomplete'
			: 'complete';
	},
	Summary: (_: SectionProps) => <></>,
	Form: EditForm
} as Section;
