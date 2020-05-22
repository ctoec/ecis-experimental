import React from 'react';
import { FamilyDetermination } from '../../../../../../generated';
import { Card } from '../../../../../../components';
import { CardExpansion } from '../../../../../../components/Card/CardExpansion';
import { CardContentWithExpandCard } from './CardContentWithExpandCard';

/**
 * Card that displays an income determination record.
 * Has CardContentWithExpandCard as card content, and
 * renders passed expand Element in the CardExpansion
 */
export const DeterminationCard = ({
	determination,
	isCurrent,
	forceClose,
	isNew = false,
	expansion,
}: {
	determination: FamilyDetermination;
	isCurrent: boolean;
	forceClose: boolean;
	isNew?: boolean;
	expansion: JSX.Element;
}) => {
	return (
		<Card
			className="margin-bottom-2"
			appearance={isCurrent ? 'primary' : 'secondary'}
			forceClose={forceClose}
			showTag={isCurrent ? isNew : undefined}
			key={determination.id}
		>
			<CardContentWithExpandCard determination={determination} />
			{!!expansion && <CardExpansion>{expansion}</CardExpansion>}
		</Card>
	);
};
