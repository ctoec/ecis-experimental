import React from 'react';
import { Section } from '../enrollmentTypes';
import Button from '../../../components/Button/Button';

const FamilyInfo: Section = {
	key: 'family-information',
	name: 'Family information',
	status: () => 'complete',

	Summary: ({ child }) => {
		if (!child || !child.family) {
			return <div></div>;
		}

		return (
			<div className="FamilyInfoSummary">
				<p>Care 4 Kids case number: {child.family.caseNumber ? child.family.caseNumber : ''}</p>
			</div>
		);
	},

	Form: ({ child, afterSave }) => {
		if (!child) {
			throw new Error('FamilyInfo rendered without a child');
		}

		const [caseNumber, updateCaseNumber] = React.useState(
			child.family ? child.family.caseNumber : null
		);

		const save = () => {
			// Mutate the data here.
			if (afterSave) {
				afterSave();
			}
		};

		return (
			<div className="FamilyInfoForm">
				<input
					type="text"
					name="caseNumber"
					placeholder="Care 4 Kids case number"
					onChange={event => updateCaseNumber(parseInt(event.target.value, 10))}
					value={caseNumber || ''}
				/>
				<br />
				<br />

				<Button text="Save" onClick={save} />
			</div>
		);
	},
};

export default FamilyInfo;
