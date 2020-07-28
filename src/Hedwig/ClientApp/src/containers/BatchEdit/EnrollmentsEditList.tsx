import React, { useState, useEffect } from 'react';
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
	replaceEnrollment: (_: Enrollment) => void;
	pathToReport: string;
};

export const EnrollmentsEditList: React.FC<EnrollmentsEditListProps> = ({
	enrollments,
	replaceEnrollment,
	pathToReport,
}) => {
	const [currentEnrollmentIdx, setCurrentEnrollmentIdx] = useState<number>();
	useEffect(() => {
		if(enrollments.length) setCurrentEnrollmentIdx(0)
	}, [enrollments.length])

	const moveNext = () => {
		if (currentEnrollmentIdx === enrollments.length - 1) {
			const stillMissingInfoEnrollmentIdx = enrollments.findIndex((e) =>
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
			items={enrollments.map((enrollment) => ({
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
					<Link to={pathToReport}>Return to report roster</Link>
				</div>
			}
		/>
	);
};
