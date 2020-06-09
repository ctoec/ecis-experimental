import React from 'react';
import { TabNav } from '../../../../../components/TabNav/TabNav';
import { EnrollmentFundingForm } from './EnrollmentFunding';
import { Care4KidsForm } from './Care4Kids';
import { SectionProps } from '../../../enrollmentTypes';

export default (props: JSX.IntrinsicAttributes & SectionProps) => (
	<TabNav
		items={[
			{
				text: 'Enrollment/Funding',
				content: <EnrollmentFundingForm {...props} />,
				default: true,
			},
			{ text: 'Care 4 Kids', content: <Care4KidsForm {...props} /> },
		]}
	/>
);
