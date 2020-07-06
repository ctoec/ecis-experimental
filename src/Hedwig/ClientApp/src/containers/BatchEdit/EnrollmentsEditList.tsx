import React, { useState } from 'react';
import { Enrollment } from '../../generated';
import { SideNav, TextWithIcon, InlineIcon } from '../../components';
import { lastFirstNameFormatter } from '../../utils/stringFormatters';
import { hasValidationErrors } from '../../utils/validations';
import { SingleEnrollmentEdit } from './SingleEnrollmentEdit';
import { ReactComponent as Success } from '../../../node_modules/uswds/dist/img/alerts/success.svg';
import { Link } from 'react-router-dom';
import { getMissingInfoPrettyString } from '../../utils/validations/getMissingInfoPrettyString';

type EnrollmentsEditListProps = {
	enrollments: Enrollment[];
	activeEnrollmentId?: number;
};

export const EnrollmentsEditList: React.FC<EnrollmentsEditListProps> = ({
	enrollments,
	activeEnrollmentId,
}) => {
	const [mutatedEnrollments, setMutatedEnrollments] = useState(enrollments);

	// Function to enable SingleEnrollmentEdit components to update the
	// single enrollment they control in the list of user-mutated enrollments.
	// Will be passed down into SingleEnrollmentEdit
	const replaceEnrollment = (updatedEnrollment: Enrollment) => {
		setMutatedEnrollments((enrollments) => {
			const enrollmentIdx = enrollments.findIndex((e) => e.id === updatedEnrollment.id);
			enrollments[enrollmentIdx] = updatedEnrollment;
			return enrollments;
		});
	};

	const [currentEnrollmentIdx, setCurrentEnrollmentIdx] = useState<number | undefined>(
		activeEnrollmentId
			? mutatedEnrollments.findIndex((e) => e.id === activeEnrollmentId)
			: mutatedEnrollments.length
			? 0
			: undefined
	);

	const moveNext = () => {
		if (currentEnrollmentIdx === mutatedEnrollments.length - 1) {
			const stillMissingInfoEnrollmentIdx = mutatedEnrollments.findIndex((e) =>
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
			items={mutatedEnrollments.map((enrollment) => ({
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
				description: getMissingInfoPrettyString(enrollment),
				content: (
					<SingleEnrollmentEdit
						key={enrollment.id}
						enrollment={enrollment}
						updateEnrollments={replaceEnrollment}
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
