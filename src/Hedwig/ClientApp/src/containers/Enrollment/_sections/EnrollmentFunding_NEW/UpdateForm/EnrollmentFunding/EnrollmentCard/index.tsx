import React, { PropsWithChildren } from 'react';
import { Enrollment, FundingSpace } from "../../../../../../../generated";
import { Card } from '../../../../../../../components';
import { prettyAge, reportingPeriodFormatter } from '../../../../../../../utils/models';
import dateFormatter from '../../../../../../../utils/dateFormatter';
import { EnrollmentFormForCard } from '../EnrollmentFormForCard';
import { FundingFormForCard } from './FundingFormForCard';

type EnrollmentCardProps = {
	enrollment: Enrollment;
	isCurrent: boolean;
	forceClose?: boolean;
	fundingSpaces?: FundingSpace[];
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
	fundingSpaces = [],
	children
}: PropsWithChildren<EnrollmentCardProps>) => {
	return (
		<Card
			className="margin-bottom-2"
			appearance={isCurrent ? 'primary' : 'secondary'}
			forceClose={forceClose}
			key={enrollment.id}
		>
			<div> {/* section with border */}
				{/* Formatted enrollment content */}	
				<div>
					<p>{prettyAge(enrollment.ageGroup)}</p>
					<p>{`${dateFormatter(enrollment.entry)} - ${enrollment.exit ? dateFormatter(enrollment.exit) : 'present'}`}</p>
				</div>
				{isCurrent && <EnrollmentFormForCard formData={enrollment} onSubmit={() => console.log("SUBMIT")}/>}

				{/* IF current enrollment:
					<expand section>
						{edit button}
					</expand section>
				*/}
				{/* if current enrollment:
					<section expand>
						<Enrollment form>
					</section expand>
				*/}
			</div>
			<span>---------------------------------------------------------------------</span>
				{children}

			<div> {/* section with border*/}
				{isCurrent // If current enrollment
					/**
						<expand section>
							{ end current funding button} { start new funding button }
						</expand section> 
					 */	
					/**
						 <section expand>
						 	{end current funding form} OR {start new funding form}
						 </sectione expand>
					 */
				}
			</div>
		</Card>
	)
}
