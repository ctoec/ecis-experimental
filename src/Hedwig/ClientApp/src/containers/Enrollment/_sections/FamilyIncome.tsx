import React from 'react';
import { Section } from '../enrollmentTypes';
import Button from '../../../components/Button/Button';

const FamilyIncome: Section = {
	key: 'family-income',
	name: 'Family income',
	status: () => 'complete',

	Summary: () => {
		return <div className="FamilyIncomeSummary"></div>;
	},

	Form: ({ afterSave }) => {
		const save = () => {
			// Mutate the data here.
			if (afterSave) {
				afterSave();
			}
		};

		return (
			<div className="FamilyIncomeForm">
				<Button text="Save" onClick={save} />
			</div>
		);
	},
};

export default FamilyIncome;
