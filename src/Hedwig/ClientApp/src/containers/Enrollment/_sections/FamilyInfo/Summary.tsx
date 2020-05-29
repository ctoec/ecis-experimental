import { Enrollment } from '../../../../generated';
import React from 'react';
import { addressFormatter, fosterText, homelessnessText } from '../../../../utils/models';
import { SectionProps } from '../../enrollmentTypes';

export const Summary: React.FC<SectionProps> = ({ enrollment }) => {
	if (!enrollment || !enrollment.child) return <></>;

	const family = enrollment.child.family;
	const [address, missingInformation] = addressFormatter(family);
	const foster = enrollment.child.foster;
	const homelessness = family && family.homelessness;
	return (
		<div className="FamilyInfoSummary">
			{family ? (
				<>
					<p>
						Address: {address} {missingInformation}
					</p>
					{foster && <p>{fosterText()}</p>}
					{homelessness && <p>{homelessnessText()}</p>}
				</>
			) : (
					<p>No family information on record.</p>
				)}
		</div>
	);
};
