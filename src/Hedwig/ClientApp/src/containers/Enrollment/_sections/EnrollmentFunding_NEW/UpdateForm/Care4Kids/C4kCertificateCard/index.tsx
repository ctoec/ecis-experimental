import React from 'react';
import { Card, Button } from '../../../../../../../components';
import { C4KCertificate } from '../../../../../../../generated';
import { CardExpansion } from '../../../../../../../components/Card/CardExpansion';
import dateFormatter from '../../../../../../../utils/dateFormatter';
import { ExpandCard } from '../../../../../../../components/Card/ExpandCard';

type C4KCertificateCardProps = {
	certificate: C4KCertificate;
	c4KFamilyId: number;
	isCurrent: boolean;
	forceClose?: boolean;
	expansion: JSX.Element;
};

export const C4KCertificateCard = ({
	certificate,
	c4KFamilyId,
	isCurrent,
	forceClose = false,
	expansion,
}: C4KCertificateCardProps) => {
	return (
		<Card
			className="margin-bottom-2"
			appearance={isCurrent ? 'primary' : 'secondary'}
			forceClose={forceClose}
			key={certificate.id}
		>
			{/* needs to be styled. maybe a component for content with ExpandCard, like in familyIncome */}
			<div id="content">
				<p>Family ID: {c4KFamilyId}</p>
				<p>Certificate start date: {dateFormatter(certificate.startDate)}</p>
				<ExpandCard>
					<Button text="Edit" appearance="unstyled" />
				</ExpandCard>
			</div>
			<CardExpansion>{expansion}</CardExpansion>
		</Card>
	);
};
