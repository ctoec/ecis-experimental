import React from 'react';
import { Enrollment } from '../../../../../../../generated';
import { Card, Button, CardProps, TextWithIcon } from '../../../../../../../components';
import { prettyAge } from '../../../../../../../utils/models';
import dateFormatter from '../../../../../../../utils/dateFormatter';
import { CardExpansion } from '../../../../../../../components/Card/CardExpansion';
import { ExpandCard } from '../../../../../../../components/Card/ExpandCard';
import { ReactComponent as Pencil } from '../../../../../../../assets/images/pencil.svg';

type EnrollmentCardProps = Exclude<CardProps, 'appearance' | 'forceClose' | 'key'> & {
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
	className,
}: EnrollmentCardProps) => {
	return (
		<Card
			appearance={isCurrent ? 'primary' : 'secondary'}
			forceClose={forceClose}
			key={enrollment.id}
			className={className}
		>
			<div className="display-flex flex-justify">
				{/* Formatted enrollment content  with ExpandCard*/}
				<div className="flex-1">
					<p className="text-bold">Site</p>
					<p>{enrollment.site?.name}</p>
				</div>
				<div className="flex-1">
					<p className="text-bold">Age group</p>
					<p>{prettyAge(enrollment.ageGroup)}</p>
				</div>
				<div className="flex-2">
					<p className="text-bold">Enrollment dates</p>
					<p>{`${dateFormatter(enrollment.entry)} - ${
						enrollment.exit ? dateFormatter(enrollment.exit) : 'present'
						}`}</p>
				</div>
				{expansion && (
					<ExpandCard>
						{/* ExpandCard provides the onclick event */}
						<Button
							text={<TextWithIcon text="Edit" Icon={Pencil} />}
							appearance="unstyled"
						/>
					</ExpandCard>
				)}
			</div>
			<CardExpansion>{expansion}</CardExpansion>
		</Card>
	);
};
