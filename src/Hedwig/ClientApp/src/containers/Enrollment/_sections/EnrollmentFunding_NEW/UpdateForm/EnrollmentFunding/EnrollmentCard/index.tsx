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
 * Where a "section" is like a card but without padding and with optional border.
 * section has an optional expand section (like card)
 * but AC for this is that the expand content replaces the normal content.
 * (i think if that's way harder we can ignore that and replicate what happens in the card
 * where the expand content is displayed below the card content)
 */
export const EnrollmentCard = ({
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
