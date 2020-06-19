import React, { useState } from 'react';
import { Enrollment } from '../../generated';
import { SideNav, TextWithIcon, InlineIcon } from '../../components';
import { lastFirstNameFormatter } from '../../utils/stringFormatters';
import { hasValidationErrors } from '../../utils/validations';
import { SingleEnrollmentEdit } from './SingleEnrollmentEdit';
import { ReactComponent as Success } from '../../../node_modules/uswds/dist/img/alerts/success.svg';
import { Link } from 'react-router-dom';

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
			const stillMissingInfoEnrollmentIdx = editedEnrollments.findIndex((e) =>
				hasValidationErrors(e)
			);
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
				title: hasValidationErrors(enrollment) ? (
					lastFirstNameFormatter(enrollment.child)
				) : (
						<TextWithIcon
							iconSide="right"
							text={lastFirstNameFormatter(enrollment.child)}
							Icon={Success}
							iconClassName="oec-inline-icon--complete"
						/>
					),
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
			noActiveItemContent={
				<div className="margin-x-4 margin-y-2 grid-row flex-align-center flex-column">
					<InlineIcon icon="complete" />
					<p className="text-bold">All children are up to date!</p>
					<Link to="/roster">Return to roster</Link>
				</div>
			}
		/>
	);
};

// TODO: IMPLEMENT THIS!!!!!
const getMissingInfoFields = (enrollment: Enrollment) => {
	// If enrollment is missing birth certificate or income determination (or re-determination), I see those missing fields named, and then I see a count of how many other fields are missing.
	console.log(enrollment)
	// If enrollment is not missing birth certificate or income determination, but are missing other fields, I only see the count of how many fields are missing: "5 fields missing".
	if (hasValidationErrors(enrollment)) return 'Birth certificate';
	return '';
};
