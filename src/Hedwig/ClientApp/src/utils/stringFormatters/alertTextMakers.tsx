import React from 'react';
import { AlertProps, Button, AlertType } from '../../components';
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
export const childWithdrawnAlert = (childName: string, siteName: string): AlertProps => ({
	type: 'success',
	heading: 'Withdrawn',
	text: `${childName} has been withdrawn. To find them again, filter the roster for ${siteName}.	`,
});

const MailToLink = () => (
	// TODO: MAKE THE BODY CONTAIN USEFUL INFORMATION LIKE URL?
	// TODO: MAKE THIS SEPARATE COMPONENT IN COMPONENT LIBRARY?
	<a
		href="mailto:oec-data-pilot@skylight.digital&subject=ECE%20reporter%20bug"
		target="_blank"
		rel="noopener noreferrer"
	>
		oec-data-pilot@skylight.digital
	</a>
);
const saveFailAlertProps: { type: AlertType; heading: string } = {
	type: 'error',
	heading: 'Something went wrong',
};
export const reportSubmitFailAlert: AlertProps = {
	...saveFailAlertProps,
	text: (
		<span>
			We were unable to submit your report. Please try again. If you continue to experience
			problems, contact {<MailToLink />} for help.
		</span>
	),
};
export const editSaveFailAlert: AlertProps = {
	...saveFailAlertProps,
	text: (
		<span>
			We were unable to save your changes. Please try again. If you continue to experience problems,
			contact {<MailToLink />} for help.
		</span>
	),
};
export const stepListSaveFailAlert: AlertProps = {
	// new enrollments
	...saveFailAlertProps,
	text: (
		<span>
			We were unable to save the information you entered. Please try again. If you continue to
			experience problems, contact {<MailToLink />} for help.
		</span>
	),
};

export const missingInformationForWithdrawalAlert: AlertProps = {
	type: 'error',
	heading: 'Information needed to withdraw child',
	text:
		'To withdraw a child from a funded space in your program, they cannot have any missing information. Please enter all missing information indicated below to withdraw this child.',
};

export const validationErrorAlert: AlertProps = {
	...saveFailAlertProps,
	text: (
		<span>
			We couldn't save your changes because we detected a potential inconsistency in the data. This
			shouldn't have happened. Our team has been notified of the problem.
			<br />
			You may still be able to update other children on your roster. Please wait to submit a report
			to OEC until the problem is fixed. For updates, contact {<MailToLink />}.
		</span>
	),
};

export const somethingWentWrongAlert: AlertProps = {
	type: 'error',
	heading: 'Something went wrong',
	text: (
		<span>
			Something unexpected happened. Please try refreshing your page or signing out and back in. If
			you continue to see this error message, please contact {<MailToLink />} for help.
		</span>
	),
};
