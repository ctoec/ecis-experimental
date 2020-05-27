import React from 'react';
import { Section } from '../../enrollmentTypes';
import { getStatus } from './getStatus';
import { Summary } from './Summary';

const FamilyInfo: Section = {
	key: 'family-information',
	name: 'Family information',
	status: ({ enrollment }) => getStatus(enrollment || undefined),
	Summary: ({ enrollment }) => <Summary enrollment={enrollment || undefined} />,
	Form: (props) => <NewForm {...props} />,
};

export default FamilyInfo;
