import React from 'react';
import { Funding } from '../../../../../../../generated';
import { Card, Button, CardProps } from '../../../../../../../components';
import { prettyFundingSpaceTime, reportingPeriodFormatter } from '../../../../../../../utils/models';
import { CardExpansion } from '../../../../../../../components/Card/CardExpansion';
import { ExpandCard } from '../../../../../../../components/Card/ExpandCard';
import { getFundingTag } from '../../../../../../../utils/fundingType';

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
			<div className="display-flex flex-justify"> {/* formatted funding content with ExpandCard */}
				<div className="flex-1">
					<p className="text-bold">Funding</p>
					<p>{getFundingTag({ fundingSource: funding.source })}</p>
				</div>
				<div className="flex-1">
					<p className="text-bold">Space type</p>
					<p>{prettyFundingSpaceTime(funding.fundingSpace)}</p>
				</div>
				<div className="flex-2">
					<p className="text-bold">Reporting periods</p>
					<p>{reportingPeriodFormatter(funding.firstReportingPeriod)} - {funding.lastReportingPeriod ? reportingPeriodFormatter(funding.lastReportingPeriod) : 'present'}</p>
				</div>
				{expansion && <ExpandCard><Button text="Edit" appearance="unstyled" /></ExpandCard>}
			</div>
			<CardExpansion>{expansion}</CardExpansion>
		</Card>
	)
}
