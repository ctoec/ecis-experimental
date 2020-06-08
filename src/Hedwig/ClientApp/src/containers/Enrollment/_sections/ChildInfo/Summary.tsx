import React from 'react';
import { SectionProps } from '../../enrollmentTypes';
import {
	getSummaryLine,
	birthCertPresent,
	prettyMultiRace,
	prettyEthnicity,
	prettyGender,
} from '../../../../utils/models';
import { nameFormatter } from '../../../../utils/stringFormatters';
import dateFormatter from '../../../../utils/dateFormatter';
import { Gender } from '../../../../generated';

export const Summary: React.FC<SectionProps> = ({ enrollment }) => {
	var child = enrollment && enrollment.child;
	return (
		<div className="ChildInfoSummary">
			{child && (
				<>
					<p>Name: {getSummaryLine(nameFormatter(child))}</p>
					<p>Date of Birth: {getSummaryLine(dateFormatter(child.birthdate))}</p>
					<p>Birth Certificate ID: {getSummaryLine(birthCertPresent(child))}</p>
					<p>Race: {getSummaryLine(prettyMultiRace(child))}</p>
					<p>Ethnicity: {getSummaryLine(prettyEthnicity(child))}</p>
					<p>Gender: {getSummaryLine(prettyGender(child.gender || Gender.Unspecified))}</p>
				</>
			)}
		</div>
	);
};
