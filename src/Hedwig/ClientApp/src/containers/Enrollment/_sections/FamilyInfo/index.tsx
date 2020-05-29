import React from 'react';
import { Section } from '../../enrollmentTypes';
import { Status } from './Status';
import { Summary } from './Summary';
import { NewForm } from '../ChildInfo/NewForm';

const FamilyInfo: Section = {
	key: 'family-information',
	name: 'Family information',
	status: Status,
	Summary: Summary,
	Form: NewForm,
};

export default FamilyInfo;
