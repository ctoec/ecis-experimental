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

	const [currentEnrollmentIdx, setCurrentEnrollmentIdx] = useState<number | undefined>(
		activeEnrollmentId
			? editedEnrollments.findIndex((e) => e.id === activeEnrollmentId)
			: editedEnrollments.length
			? 0
			: undefined
	);

	const moveNext = () => {
		if (currentEnrollmentIdx == undefined) return;

		if (currentEnrollmentIdx === editedEnrollments.length - 1) {
			setCurrentEnrollmentIdx(undefined);
			return;
		}

		setCurrentEnrollmentIdx(currentEnrollmentIdx + 1);
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
