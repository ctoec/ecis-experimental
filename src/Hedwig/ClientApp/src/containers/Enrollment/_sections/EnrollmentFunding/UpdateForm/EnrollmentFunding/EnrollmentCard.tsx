import React, { useState } from 'react';
import { Enrollment } from '../../../../../../generated';
import {
	Card,
	Button,
	CardProps,
	TextWithIcon,
	InlineIcon,
	ExpandCard,
	CardExpansion,
} from '@ctoec/component-library';
import { prettyAge } from '../../../../../../utils/models';
import dateFormatter from '../../../../../../utils/dateFormatter';
import { ReactComponent as Pencil } from '../../../../../../assets/images/pencil.svg';

type EnrollmentCardProps = Exclude<CardProps, 'appearance' | 'forceClose' | 'key'> & {
	enrollment: Enrollment;
	isCurrent: boolean;
	forceClose?: boolean;
	expansion?: JSX.Element;
};

/**
 * Card that displays an enrollment record.
 * Optionally, renders an expansion props as the CardExpansion content,
 * which will be an EnrollmentFormForCard
 */
export const EnrollmentCard = ({
	enrollment,
	isCurrent,
	forceClose = false,
	expansion,
	className,
}: EnrollmentCardProps) => {
	// State var to persist expanded state between renders.
	// Specifically needed to keep a card expanded when the
	// attempted edit results in an error
	const [expanded, setExpanded] = useState(forceClose);

	return (
		<Card
			expanded={expanded}
			appearance={isCurrent ? 'primary' : 'secondary'}
			forceClose={forceClose}
			key={`${enrollment.id}-${enrollment.entry}-${enrollment.exit}-${enrollment.ageGroup}`}
			className={className}
		>
			<div className="display-flex flex-justify">
				<div className="flex-1">
					<p>Site</p>
					<p className="text-bold">{enrollment.site?.name}</p>
				</div>
				<div className="flex-1">
					<p>Age group</p>
					<p className="text-bold">
						{enrollment.ageGroup
							? prettyAge(enrollment.ageGroup)
							: InlineIcon({ icon: 'incomplete' })}
					</p>
				</div>
				<div className="flex-2">
					<p>Enrollment dates</p>
					<p className="text-bold">
						{!enrollment.entry
							? InlineIcon({ icon: 'incomplete' })
							: `${dateFormatter(enrollment.entry)} - ${enrollment.exit ? dateFormatter(enrollment.exit) : 'present'}`}
					</p>
				</div>
				{expansion && (
					<ExpandCard>
						{/* ExpandCard provides the onclick event */}
						<Button
							text={<TextWithIcon text="Edit" Icon={Pencil as React.FC} />}
							appearance="unstyled"
							onClick={() => setExpanded((e) => !e)}
						/>
					</ExpandCard>
				)}
			</div>
			<CardExpansion>{expansion}</CardExpansion>
		</Card>
	);
};
