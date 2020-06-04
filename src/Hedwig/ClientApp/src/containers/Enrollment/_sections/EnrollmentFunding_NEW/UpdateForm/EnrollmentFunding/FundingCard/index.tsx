import React from 'react';
import { Funding } from '../../../../../../../generated';
import { Card, Button, CardProps } from '../../../../../../../components';
import { prettyFundingSource, prettyFundingSpaceTime, reportingPeriodFormatter } from '../../../../../../../utils/models';
import { CardExpansion } from '../../../../../../../components/Card/CardExpansion';
import { ExpandCard } from '../../../../../../../components/Card/ExpandCard';

type FundingCardProps = Exclude<CardProps, 'appearance' | 'forceClose' | 'key'> & {
	funding: Funding;
	isCurrent: boolean;
	forceClose: boolean;
	expansion?: JSX.Element;
}

export const FundingCard = ({
	funding,
	isCurrent,
	forceClose,
	expansion,
	className
}: FundingCardProps) => {
	return (
		<Card
			appearance={isCurrent ? 'primary' : 'secondary'}
			forceClose={forceClose}
			key={funding.id}
			className={className}
		>
			<div> {/* formatted funding content with ExpandCard */}
				<div>
					<p>Funding: {prettyFundingSource(funding.source)}</p>
					<p>Space type: {prettyFundingSpaceTime(funding.fundingSpace)}</p>
					<p>reporting periods: {reportingPeriodFormatter(funding.firstReportingPeriod)} - {funding.lastReportingPeriod ? reportingPeriodFormatter(funding.lastReportingPeriod) : 'present'}</p>
				</div>
				{expansion && <ExpandCard><Button text="Edit" appearance="unstyled" /></ExpandCard>}
			</div>
			<CardExpansion>{expansion}</CardExpansion>
		</Card>
	)
}
