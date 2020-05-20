import React  from 'react';
import { FamilyDetermination, Enrollment } from "../../../../../generated"
import { Card } from "../../../../../components"
import { CardContentWithExpandCard } from './_cardContent';
import { CardExpansion } from '../../../../../components/Card/CardExpansion';
 

export const EditableDeterminationCard = ({
	determination,
	isCurrent,
	forceClose,
	isNew = false,
	expansion,
}:
	{
		determination: FamilyDetermination;
		isCurrent: boolean;
		forceClose: boolean;
		isNew?: boolean;
		expansion: JSX.Element;
	}
) => {
	return <Card
		className="margin-bottom-2"
		forceClose={forceClose}
		showTag={isCurrent ? isNew : undefined}
		key={determination.id}
	>
		<CardContentWithExpandCard determination={determination} />
		{!!expansion && 
			<CardExpansion>
				{expansion}
			</CardExpansion>
		}
	</Card>
}
