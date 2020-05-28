import { Section } from '../../enrollmentTypes';
import { Status } from './Status';
import { Summary } from './Summary';
import { NewForm } from './NewForm';

export default {
	key: 'child-information',
	name: 'Child information',
	status: Status,
	Summary: Summary,
	Form: NewForm,
} as Section;
