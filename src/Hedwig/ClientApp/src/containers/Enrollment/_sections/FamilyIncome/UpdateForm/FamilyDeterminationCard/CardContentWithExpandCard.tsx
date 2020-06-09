import { FamilyDetermination } from '../../../../../../generated';
import React from 'react';
import { InlineIcon, Button, TextWithIcon } from '../../../../../../components';
import currencyFormatter from '../../../../../../utils/currencyFormatter';
import dateFormatter from '../../../../../../utils/dateFormatter';
import { ExpandCard } from '../../../../../../components/Card/ExpandCard';
import { ReactComponent as Pencil } from '../../../../../../assets/images/pencil.svg';

/**
 * Component with the content for a Determination Card.
 * Formats determination data for display in a Card, and
 * creates an ExpandCard with unstyled `Edit` button.
 */
export const CardContentWithExpandCard = ({
	determination,
}: {
	determination: FamilyDetermination;
}) => {
	return (
		<div className="display-flex flex-justify">
			<div className="flex-1">
				<p>Household size</p>
				<p className="text-bold">{determination.numberOfPeople || InlineIcon({ icon: 'incomplete' })}</p>
			</div>
			<div className="flex-1">
				<p>Income</p>
				<p className="text-bold">
					{determination.income
						? currencyFormatter(determination.income)
						: InlineIcon({ icon: 'incomplete' })}
				</p>
			</div>
			<div className="flex-2">
				<p>Determination on</p>
				<p className="text-bold">
					{determination.determinationDate
						? dateFormatter(determination.determinationDate)
						: InlineIcon({ icon: 'incomplete' })}
				</p>
			</div>
			<ExpandCard>
				<Button text={<TextWithIcon text="Edit" Icon={Pencil} />} appearance="unstyled" />
			</ExpandCard>
		</div >
	);
};
