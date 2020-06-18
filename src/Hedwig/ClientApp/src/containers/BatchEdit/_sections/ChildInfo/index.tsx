import React from 'react';
import { EditForm } from './EditForm';
import { StepProps } from '../../../../components';
import { BatchEditStepProps } from '../batchEditTypes';
import { hasValidationErrors } from '../../../../utils/validations';

export default {
	key: 'child-info',
	name: "Child's information",
	status: ({ enrollment }) =>
		hasValidationErrors(enrollment.child, [
			'birthdate',
			'birthCertificateId',
			'birthtown',
			'birthstate',
			'hispanicOrLatinxEthnicity',
			'americanIndianOrAlaskaNative',
			'asian',
			'blackOrAfricanAmerican',
			'nativeHawaiianOrPacificIslander',
			'white',
			'gender',
		])
			? 'incomplete'
			: 'complete',
	Summary: () => <></>,
	Form: EditForm,
} as StepProps<BatchEditStepProps>;
