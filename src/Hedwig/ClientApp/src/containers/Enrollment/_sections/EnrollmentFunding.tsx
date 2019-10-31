import React from 'react';
import { Section } from '../enrollmentTypes';
import Button from '../../../components/Button/Button';

const EnrollmentFunding: Section = {
	id: 'enrollment-funding',
	name: 'Enrollment and funding',
	status: () => 'complete',

	Summary: () => {
		return <div className="EnrollmentFundingSummary"></div>;
	},

	Form: ({ afterSave }) => {
		const save = () => {
			// Mutate the data here.
			afterSave();
		};

		return (
			<div className="EnrollmentFundingForm">
				<Button text="Save" onClick={save} />
			</div>
		);
	},
};

export default EnrollmentFunding;
