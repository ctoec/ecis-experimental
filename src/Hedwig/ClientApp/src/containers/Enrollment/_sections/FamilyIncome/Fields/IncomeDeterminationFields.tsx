import React from 'react';
import { HouseholdSizeField, AnnualHouseholdIncomeField, DeterminationDateField } from '.';
import { headerLevels, PossibleHeaderLevels } from '../../../enrollmentTypes';

type IncomeDeterminationFieldsProps = {
	type: 'new' | 'redetermine' | 'edit';
	determinationId: number;
	blockErrorDisplay?: boolean;
	headerLevel?: PossibleHeaderLevels
};

export const IncomeDeterminationFields: React.FC<IncomeDeterminationFieldsProps> = ({
	type,
	determinationId,
	blockErrorDisplay = false,
	headerLevel = headerLevels[3]
}) => {
	let headerText, showHeader;
	switch (type) {
		case 'redetermine':
			headerText = 'Redetermine family income';
			showHeader = true;
			break;

		case 'edit':
			headerText = 'Edit family income';
			showHeader = true;
			break;

		case 'new':
			headerText = 'Family income determination';
			showHeader = false;
			break;
	}

	const Header = headerLevel

	return (
		<>
			{showHeader && <Header>{headerText}</Header>}
			<div>
				<HouseholdSizeField
					determinationId={determinationId}
					blockErrorDisplay={blockErrorDisplay}
				/>
			</div>
			<div>
				<AnnualHouseholdIncomeField
					determinationId={determinationId}
					blockErrorDisplay={blockErrorDisplay}
				/>
			</div>
			<div>
				<DeterminationDateField
					determinationId={determinationId}
					blockErrorDisplay={blockErrorDisplay}
				/>
			</div>
		</>
	);
};
