import React, { useState } from 'react';
import { Enrollment, SiteFromJSON } from '../../generated';
import { SideNav } from '../../components';
import { lastFirstNameFormatter, nameFormatter } from '../../utils/stringFormatters';
import { hasValidationErrors } from '../../utils/validations';
import { SingleEnrollmentEdit } from './SingleEnrollmentEdit';

type EnrollmentsEditListProps = {
	enrollments: Enrollment[];
	activeEnrollmentId?: number;
};

export const EnrollmentsEditList: React.FC<EnrollmentsEditListProps> = ({
	enrollments,
	activeEnrollmentId
}) => {
	const [editedEnrollments, setEditedEnrollments] = useState(enrollments);

	const [currentEnrollmentIdx, setCurrentEnrollmentIdx] = useState<number|undefined>(
		activeEnrollmentId 
			? editedEnrollments.findIndex((e) => e.id === activeEnrollmentId) 
			: (editedEnrollments.length ? 0: undefined));

	const moveNext = () => {
		console.log("current enrollment idx", currentEnrollmentIdx);
		if(currentEnrollmentIdx == undefined) return;

		console.log('editedEnrollments.length', editedEnrollments.length);
		if(currentEnrollmentIdx === editedEnrollments.length - 1) {
			setCurrentEnrollmentIdx(undefined);
			return;
		}

		console.log("next");

		setCurrentEnrollmentIdx(currentEnrollmentIdx + 1);
	}

	return (
		<SideNav
			externalActiveItemIndex={currentEnrollmentIdx}
			items={
				editedEnrollments.map((enrollment, idx) => ({
					title: lastFirstNameFormatter(enrollment.child),
					description:	getMissingInfoFields(enrollment),
					content: <SingleEnrollmentEdit enrollmentId={enrollment.id} siteId={enrollment.siteId} moveNextEnrollment={moveNext}/>
				}))
			}
		/>
	);
}

const getMissingInfoFields = (enrollment: Enrollment) => {
	if(hasValidationErrors(enrollment)) return 'Birth certificate';
	return '';
}
