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
	activeEnrollmentId,
}) => {
	const [editedEnrollments, setEditedEnrollments] = useState(enrollments);

	// Function to enable SingleEnrollmentEdit components to update the
	// single enrollment they control in the list of edited enrollments.
	// Will be passed down into SingleEnrollmentEdit
	const replaceEnrollment = (updatedEnrollment: Enrollment) => {
		setEditedEnrollments((enrollments) => {
			const enrollmentIdx = enrollments.findIndex((e) => e.id === updatedEnrollment.id);
			enrollments[enrollmentIdx] = updatedEnrollment;
			return enrollments;
		});
	};

	const [currentEnrollmentIdx, setCurrentEnrollmentIdx] = useState<number | undefined>(
		activeEnrollmentId
			? editedEnrollments.findIndex((e) => e.id === activeEnrollmentId)
			: editedEnrollments.length
			? 0
			: undefined
	);

	const moveNext = () => {
		if (currentEnrollmentIdx === editedEnrollments.length - 1) {
			const stillMissingInfoEnrollmentIdx = enrollments.findIndex((e) => hasValidationErrors(e));
			setCurrentEnrollmentIdx(
				stillMissingInfoEnrollmentIdx < 0 ? undefined : stillMissingInfoEnrollmentIdx
			);
			return;
		}

		setCurrentEnrollmentIdx((idx) => (idx !== undefined ? idx + 1 : idx));
	};

	return (
		<SideNav
			externalActiveItemIndex={currentEnrollmentIdx}
			items={editedEnrollments.map((enrollment, idx) => ({
				title: lastFirstNameFormatter(enrollment.child),
				description: getMissingInfoFields(enrollment),
				content: (
					<SingleEnrollmentEdit
						enrollmentId={enrollment.id}
						updateEnrollments={replaceEnrollment}
						siteId={enrollment.siteId}
						moveNextEnrollment={moveNext}
					/>
				),
			}))}
			// TODO: IMPLEMENT THIS!!!!
			// noActiveItemContent={}
		/>
	);
};

// TODO: IMPLEMENT THIS!!!!!
const getMissingInfoFields = (enrollment: Enrollment) => {
	if (hasValidationErrors(enrollment)) return 'Birth certificate';
	return '';
};
