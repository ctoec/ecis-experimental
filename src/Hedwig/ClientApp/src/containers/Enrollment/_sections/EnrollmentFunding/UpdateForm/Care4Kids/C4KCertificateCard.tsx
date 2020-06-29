import React from 'react';
import { Card, Button, TextWithIcon } from '../../../../../../components';
import { C4KCertificate } from '../../../../../../generated';
import { CardExpansion } from '../../../../../../components/Card/CardExpansion';
import dateFormatter from '../../../../../../utils/dateFormatter';
import { ExpandCard } from '../../../../../../components/Card/ExpandCard';
import { ReactComponent as Pencil } from '../../../../../../assets/images/pencil.svg';

type C4KCertificateCardProps = {
	certificate: C4KCertificate;
	c4KFamilyId?: number | null;
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
			appearance={isCurrent ? 'primary' : 'secondary'}
			forceClose={forceClose}
			className="margin-bottom-2"
			key={JSON.stringify(certificate)}
		>
			{/* needs to be styled. maybe a component for content with ExpandCard, like in familyIncome */}
			<div className="display-flex flex-justify">
				<div className="flex-1">
					<p>Family ID</p>
					<p className="text-bold">{c4KFamilyId}</p>
				</div>
				<div className="flex-2">
					<p>Certificate start date</p>
					<p className="text-bold">{dateFormatter(certificate.startDate)}</p>
				</div>
				<ExpandCard>
					<Button
						text={<TextWithIcon text="Edit" Icon={Pencil} />}
						appearance="unstyled"
						className="flex-1"
					/>
				</ExpandCard>
			</div>
			<CardExpansion>{expansion}</CardExpansion>
		</Card>
	);
};
