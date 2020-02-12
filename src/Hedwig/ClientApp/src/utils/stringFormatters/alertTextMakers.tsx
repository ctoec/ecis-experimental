import React from 'react';
import { AlertProps, Button } from '../../components';
import { ReportingPeriod } from '../../generated';
import { reportingPeriodFormatter } from '../models';
import pluralize from 'pluralize';

export const newEnrollmentCompleteAlert = (childName: string): AlertProps => ({
	type: 'success',
	heading: 'Enrolled',
	text: `${childName} has been enrolled.`,
});
export const newEnrollentMissingInfoAlert = (childName: string): AlertProps => ({
	type: 'success',
	heading: 'Enrolled, some information missing',
	text: `${childName} has been enrolled. However, additional information is required for OEC reporting.`,
});
export const editEnrollmentCompleteAlert = (childName: string): AlertProps => ({
	type: 'success',
	heading: 'Updated',
	text: `${childName} has been enrolled.	`,
});
export const editEnrollmentMissingInfoAlert = (childName: string): AlertProps => ({
	type: 'success',
	heading: 'Updated, some information missing',
	text: `${childName} has been updated.`,
});
export const updateRosterAlert = (numMissingInfo: number): AlertProps => ({
	type: 'error',
	heading: 'Update roster',
	text: `There ${numMissingInfo === 1 ? 'is' : 'are'} ${pluralize(
		'enrollment',
		numMissingInfo,
		true
	)} missing information required to submit this report.`,
	actionItem: <Button text="Update roster" href="/roster" />,
});
export const reportSubmittedAlert = (reportingPeriod: ReportingPeriod): AlertProps => ({
	type: 'success',
	heading: 'Submitted',
	text: `Your ${reportingPeriodFormatter(
		reportingPeriod
	)} CDC Report has been shared with the Office of Early Childhood. Thank you!`,
});
export const childWithdrawnAlert = (childName: string): AlertProps => ({
	type: 'success',
	heading: 'Withdrawn',
	text: `${childName} has been withdrawn. To find them again, filter the roster for past enrollments.	`,
});
