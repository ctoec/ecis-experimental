import { Section } from '../../enrollmentTypes';
import { NewForm } from './NewForm';
import UpdateForm from './UpdateForm';
import EnrollmentFunding from '../EnrollmentFunding';

export default {
	key: 'enrollment-funding',
	name: 'Enrollment and funding',
	status: () => 'complete',
	Summary: EnrollmentFunding.Summary,
	Form: NewForm,
	UpdateForm: UpdateForm,
} as Section;
