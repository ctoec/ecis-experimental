import { Section } from '../../enrollmentTypes';
import { NewForm } from './NewForm';
import { UpdateForm } from './UpdateForm';
import { Summary } from './Summary';
import { Status } from './Status';

export default {
	key: 'enrollment-funding',
	name: 'Enrollment and funding',
	status: Status,
	Summary: Summary,
	Form: NewForm,
	UpdateForm: UpdateForm,
} as Section;
