import React from 'react';
import { SectionProps } from '../../../../enrollmentTypes';
import { UpdateFormSectionProps } from '../common';

export const Care4KidsForm: React.FC<UpdateFormSectionProps> = ({
	mutatedEnrollment,
	saveError,
	setMutatedEnrollment,
	setAttemptingSave,
}) => {
	if (!mutatedEnrollment || !mutatedEnrollment.child) {
		throw new Error('Section rendered without enrollment or child');
	}

	return <>CARE FOR KIDS</>;
};
