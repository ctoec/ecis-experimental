import React from 'react';
import { SectionProps } from "../../../../enrollmentTypes";

export const Care4KidsForm = ({enrollment, siteId}: SectionProps) => {
	if (!enrollment || !enrollment.child) {
		throw new Error('Section rendered without enrollment or child');
	} 

	return;
		
}
