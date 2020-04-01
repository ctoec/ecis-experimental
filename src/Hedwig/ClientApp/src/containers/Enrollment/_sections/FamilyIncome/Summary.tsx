import React from 'react';
import idx from 'idx';
import { processValidationError } from '../../../../utils/validations';
import { InlineIcon } from '../../../../components';
import currencyFormatter from '../../../../utils/currencyFormatter';
import dateFormatter from '../../../../utils/dateFormatter';
import { SectionProps } from '../../enrollmentTypes';
import { inverseDeterminationSorter } from '../../../../utils/models';
import { FamilyDetermination } from '../../../../generated';

const Summary: React.FC<SectionProps> = ({ enrollment }) => {
	if (!enrollment || !enrollment.child || !enrollment.child.family) return <></>;
	const determinations =
		idx(enrollment, _ => _.child.family.determinations as FamilyDetermination[]) || [];
	const sortedDeterminations = [...determinations].sort(inverseDeterminationSorter);
	const determination = sortedDeterminations[0];
	const isFoster = enrollment.child.foster;
	let elementToReturn;

	if (isFoster) {
		elementToReturn = (
			<p>Household Income: This information is not required for foster children.</p>
		);
	} else if (
		!determination &&
		!processValidationError(
			'child.family.determinations',
			enrollment ? enrollment.validationErrors : null
		)
	) {
		elementToReturn = <p>No income determination on record.</p>;
	} else if (determination && determination.notDisclosed) {
		elementToReturn = <p>Income determination not disclosed.</p>;
	} else {
		elementToReturn = (
			<>
				<p>
					Household size:{' '}
					{determination && determination.numberOfPeople
						? determination.numberOfPeople
						: InlineIcon({ icon: 'incomplete' })}
				</p>
				<p>
					Annual household income:{' '}
					{determination && determination.income !== null && determination.income !== undefined
						? currencyFormatter(determination.income)
						: InlineIcon({ icon: 'incomplete' })}
				</p>
				<p>
					Determined on:{' '}
					{determination && determination.determinationDate
						? dateFormatter(determination.determinationDate)
						: InlineIcon({ icon: 'incomplete' })}
				</p>
			</>
		);
	}

	return <div className="FamilyIncomeSummary">{elementToReturn}</div>;
};

export default Summary;
