import { Section } from '../../enrollmentTypes';
import { NewForm } from './NewForm';
// Why is typescript being weird about the index.tsx file??
import UpdateForm from './UpdateForm/index';
import EnrollmentFunding from '../EnrollmentFunding';

export default {
	key: 'enrollment-funding',
	name: 'Enrollment and funding',
	status: () => 'complete',
	Summary: EnrollmentFunding.Summary,
	Form: NewForm,
	UpdateForm: UpdateForm,
} as Section;
