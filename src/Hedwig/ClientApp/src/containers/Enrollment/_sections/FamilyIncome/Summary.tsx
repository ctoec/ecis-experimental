import React from 'react';
import idx from 'idx';
import { InlineIcon } from '../../../../components';
import currencyFormatter from '../../../../utils/currencyFormatter';
import dateFormatter from '../../../../utils/dateFormatter';
import { SectionProps } from '../../enrollmentTypes';
import { FamilyDetermination } from '../../../../generated';
import { propertyDateSorter } from '../../../../utils/dateSorter';

/**
 * Most recent determination is displayed in the Summary. 
 * 
 * If the enrollment is exempt from family income determination requirement,
 * we display that this information is not required.
 * 
 * If the enrollment has no determinations, we display that there is no 
 * income determination on record
 * 
 * Otherwise, we display the data from the most recent determination, indicating
 * what is missing.
 */
export const Summary: React.FC<SectionProps> = ({ enrollment }) => {
	if (!enrollment || !enrollment.child) return <></>;
	const determinations =
		idx(enrollment, _ => _.child.family.determinations as FamilyDetermination[]) || [];
	const sortedDeterminations = [...determinations].sort((a, b) =>
		propertyDateSorter(a, b, d => d.determinationDate, true)
	);
	const determination = sortedDeterminations[0];
	const isFoster = enrollment.child.foster;
	let elementToReturn;

	if (isFoster) {
		elementToReturn = (
			<p>Household Income: This information is not required for foster children.</p>
		);
	} else if (!determination) { // no most recent determination means no determinations existed at all
		elementToReturn = <p>No income determination on record.</p>; 
	} else {
		elementToReturn = (
			<>
				<p>
					Household size:{' '}
					{determination.numberOfPeople || InlineIcon({ icon: 'incomplete' })}
				</p>
				<p>
					Annual household income:{' '}
					{determination.income != undefined
						? currencyFormatter(determination.income)
						: InlineIcon({ icon: 'incomplete' })}
				</p>
				<p>
					Determined on:{' '}
					{determination.determinationDate
						? dateFormatter(determination.determinationDate)
						: InlineIcon({ icon: 'incomplete' })}
				</p>
			</>
		);
	}

	return <div className="FamilyIncomeSummary">{elementToReturn}</div>;
};
