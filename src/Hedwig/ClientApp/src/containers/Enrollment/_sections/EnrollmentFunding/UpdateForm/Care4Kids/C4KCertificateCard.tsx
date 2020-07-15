import React from 'react';
import { Card, Button, TextWithIcon, InlineIcon } from '@ctoec/component-library';
import { C4KCertificate } from '../../../../../../generated';
// TODO
import { CardExpansion } from '../../../../../../components/Card/CardExpansion';
import dateFormatter from '../../../../../../utils/dateFormatter';
import { ExpandCard } from '../../../../../../components/Card/ExpandCard';
import { ReactComponent as Pencil } from '../../../../../../assets/images/pencil.svg';
import { hasValidationErrors } from '../../../../../../utils/validations';

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
					<p className="text-bold">
						{!c4KFamilyId ? <InlineIcon icon="incomplete" /> : c4KFamilyId}
					</p>
				</div>
				<div className="flex-2">
					<p>Certificate dates</p>
					<p className="text-bold">
						{hasValidationErrors(certificate, ['startDate']) ? (
							<InlineIcon icon="incomplete" />
						) : (
								`${dateFormatter(certificate.startDate)}${
								!isCurrent ? `- ${dateFormatter(certificate.endDate)}` : ''
								}`
							)}
					</p>
				</div>

				<ExpandCard>
					<Button
						text={<TextWithIcon text="Edit" Icon={Pencil as React.FC} />}
						appearance="unstyled"
						className="flex-1"
					/>
				</ExpandCard>
			</div>
			<CardExpansion>{expansion}</CardExpansion>
		</Card>
	);
};
