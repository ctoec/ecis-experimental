import React from 'react';
import { EditForm } from './EditForm';
import { StepProps, TextWithIcon, InlineIcon } from '../../../../components';
import { BatchEditStepProps } from '../batchEditTypes';
import { hasValidationErrors } from '../../../../utils/validations';
import { Enrollment } from '../../../../generated';

const hasChildInfoValidationErrors = (enrollment: Enrollment) =>
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
	]);

export default {
	key: 'child-info',
	name: "Child's information",
	status: ({ enrollment }) =>
		hasChildInfoValidationErrors(enrollment) ? 'incomplete' : 'complete',
	Summary: ({ enrollment }) =>
		hasChildInfoValidationErrors(enrollment) ? (
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
