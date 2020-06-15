import React, { useState } from 'react';
import { Enrollment } from '../../generated';
import { SideNav, InlineIcon, TextWithIcon, Button } from '../../components';
import { lastFirstNameFormatter } from '../../utils/stringFormatters';
import { SideNavItemProps } from '../../components/SideNav/SideNavItem';
import { hasValidationErrors } from '../../utils/validations';
import { EnrollmentEdit } from './SingleEnrollmentEdit';
import { ReactComponent as ArrowRight } from '../../assets/images/arrowRight.svg';


type BatchEditInternalProps = {
	enrollments: Enrollment[] | null;
	setRefetch: React.Dispatch<React.SetStateAction<number>>;
}
export const BatchEditInternal: React.FC<BatchEditInternalProps> = ({
	enrollments,
	setRefetch,
}) => {
	
	const needInfoEnrollments = enrollments?.filter(enrollment => (enrollment.validationErrors || []).length > 0);

	const [activeEnrollmentIdx, setActiveEnrollmentIdx] = useState<number|undefined>(0);
	const moveNext = () => {
		if(activeEnrollmentIdx == undefined) {
			return;
		}

		if(!needInfoEnrollments || needInfoEnrollments.length === 0) {
			setActiveEnrollmentIdx(undefined);
			return;
		}

		if(activeEnrollmentIdx === (needInfoEnrollments.length - 1)) {
			setActiveEnrollmentIdx(0);
			return;
		}

		// setActiveEnrollmentIdx(activeEnrollmentIdx + 1);o
		console.log('active enrollment', activeEnrollmentIdx);
	}

	console.log("Internela rerender");
	return (
			<SideNav
							externalActiveItemIndex={activeEnrollmentIdx}
							noActiveItemContent={
								<div>
									<InlineIcon icon="complete"/>
									<p>All enrollments are complete!</p>
									<Button
										appearance="unstyled"
										className="text-bold text-underline"
										text={<TextWithIcon text="Back to roster" Icon={ArrowRight} direction="right" iconSide="right" /> }
									/>
								</div>
							}
							items={
								(needInfoEnrollments || []).map((enrollment, idx) => ({
									titleLink: { 
										text: lastFirstNameFormatter(enrollment.child),
										link: ``,
									},
									description: getMissingInfoFields(enrollment),
									icon: !hasValidationErrors(enrollment) ? "complete" : undefined,
									onClick: () => {setActiveEnrollmentIdx(idx)},
									content: (
									<>
										<h2>{lastFirstNameFormatter(enrollment.child)}</h2>
										<EnrollmentEdit setRefetch={setRefetch} enrollmentId={enrollment.id} siteId={enrollment.siteId} moveNext={moveNext} />
									</>)
								} as SideNavItemProps))
							}
						/>			
	)
}

const getMissingInfoFields = (enrollment: Enrollment) => {
	return hasValidationErrors(enrollment)
		? 'Birth certificate id, income determination'
		: 'No needed information';
}
