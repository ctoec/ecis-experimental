import React from 'react';
import { Enrollment } from "../../../../../../../generated";
import { Card, Button } from '../../../../../../../components';
import { prettyAge } from '../../../../../../../utils/models';
import dateFormatter from '../../../../../../../utils/dateFormatter';
import { CardExpansion } from '../../../../../../../components/Card/CardExpansion';
import { ExpandCard } from '../../../../../../../components/Card/ExpandCard';

type EnrollmentCardProps = {
	enrollment: Enrollment;
	isCurrent: boolean;
	forceClose?: boolean;
	expansion?: JSX.Element;
};

/**
 * Use cards! Make card top/bottom border optional? so fundings can be displayed w/out separators between them
 */
export const EnrollmentCard = ({
	// EnrollmentCard will actually be EnrollmentCardSet, which will include an enrollmentCard and 0 or more fundingCards
	enrollment,
	isCurrent,
	forceClose = false,
	expansion,
}: EnrollmentCardProps) => {
	return (
		<Card
			appearance={isCurrent ? 'primary' : 'secondary'}
			forceClose={forceClose}
			key={enrollment.id}
		>
			<div>{/* Formatted enrollment content  with ExpandCard*/}
				<div>
					<p>Age group: {prettyAge(enrollment.ageGroup)}</p>
					<p>Enrollment dates: {`${dateFormatter(enrollment.entry)} - ${enrollment.exit ? dateFormatter(enrollment.exit) : 'present'}`}</p>
				</div>
				{expansion && <ExpandCard><Button text="Edit" appearance="unstyled" /></ExpandCard>}

			</div>
			<CardExpansion>{expansion}</CardExpansion>

		</Card>
	)
}
