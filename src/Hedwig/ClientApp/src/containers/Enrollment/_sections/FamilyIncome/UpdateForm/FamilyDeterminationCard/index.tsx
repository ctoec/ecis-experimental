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
export const FamilyDeterminationCard = ({
	determination,
	isCurrent,
	isNew = false,
	forceClose,
	expansion,
}: {
	determination: FamilyDetermination;
	isCurrent: boolean;
	isNew?: boolean;
	forceClose: boolean;
	expansion: JSX.Element;
}) => {
	return (
		<Card
			className="margin-bottom-2"
			appearance={isCurrent ? 'primary' : 'secondary'}
			showTag={isCurrent ? isNew : undefined}
			forceClose={forceClose}
			key={determination.id}
		>
			<CardContentWithExpandCard determination={determination} />
			<CardExpansion>{expansion}</CardExpansion>
		</Card>
	);
};
