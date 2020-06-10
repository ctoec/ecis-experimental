import React from 'react';
import { Funding } from '../../../../../../generated';
import { Card, Button, CardProps, TextWithIcon } from '../../../../../../components';
import { prettyFundingSpaceTime, reportingPeriodFormatter } from '../../../../../../utils/models';
import { CardExpansion } from '../../../../../../components/Card/CardExpansion';
import { ExpandCard } from '../../../../../../components/Card/ExpandCard';
import { getFundingTag } from '../../../../../../utils/fundingType';
import { ReactComponent as Pencil } from '../../../../../../assets/images/pencil.svg';

type FundingCardProps = Pick<
	CardProps,
	Exclude<keyof CardProps, 'appearance' | 'forceClose' | 'key'>
> & {
	funding: Funding;
	isCurrent: boolean;
	forceClose: boolean;
	expansion?: JSX.Element;
};

export const FundingCard = ({
	funding,
	isCurrent,
	forceClose,
	expansion,
	className,
}: FundingCardProps) => {
	return (
		<Card
			appearance={isCurrent ? 'primary' : 'secondary'}
			forceClose={forceClose}
			key={funding.id}
			className={className}
		>
			<div className="display-flex flex-justify">
				{' '}
				<div className="flex-1">
					<p>Funding</p>
					<p>{getFundingTag({ fundingSource: funding.source })}</p>
				</div>
				<div className="flex-1">
					<p>Space type</p>
					<p className="text-bold">{prettyFundingSpaceTime(funding.fundingSpace)}</p>
				</div>
				<div className="flex-2">
					<p>Reporting periods</p>
					<p className="text-bold">
						{reportingPeriodFormatter(funding.firstReportingPeriod)} -{' '}
						{funding.lastReportingPeriod
							? reportingPeriodFormatter(funding.lastReportingPeriod)
							: 'present'}
					</p>
				</div>
				{expansion && (
					<ExpandCard>
						<Button text={<TextWithIcon text="Edit" Icon={Pencil} />} appearance="unstyled" />
					</ExpandCard>
				)}
			</div>
			<CardExpansion>{expansion}</CardExpansion>
		</Card>
	);
};
