import React, { useContext, useState, useEffect } from 'react';
import { History } from 'history';
import UserContext from '../../contexts/User/UserContext';
import {
	Enrollment,
	ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGetRequest,
	ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest,
} from '../../generated';
import { nameFormatter, splitCamelCase, childWithdrawnAlert } from '../../utils/stringFormatters';
import {
	getCurrentCdcFunding,
	reportingPeriodFormatter,
	getIdForUser,
	prettyFundingSpaceTime,
} from '../../utils/models';
import useApi, { ApiError } from '../../hooks/useApi';
import { useFocusFirstError, hasValidationErrors } from '../../utils/validations';
import AlertContext from '../../contexts/Alert/AlertContext';
import { missingInformationForWithdrawalAlert } from '../../utils/stringFormatters/alertTextMakers';
import CommonContainer from '../CommonContainer';
import { InlineIcon, Button } from '../../components';
import dateFormatter from '../../utils/dateFormatter';
import { getFundingTag } from '../../utils/fundingType';
import { Form, FormSubmitButton } from '../../components/Form_New';
import { EnrollmentEndDateField } from './Fields/EnrollmentEndDate';
import { ExitReasonField } from './Fields/ExitReason';
import { LastReportingPeriodField } from './Fields/LastReportingPeriod';
import useCatchallErrorAlert from '../../hooks/useCatchallErrorAlert';

type WithdrawalProps = {
	history: History;
	match: {
		params: {
			siteId: number;
			enrollmentId: number;
		};
	};
};

export default function Withdrawal({
	history,
	match: {
		params: { siteId, enrollmentId },
	},
}: WithdrawalProps) {
	const { user } = useContext(UserContext);
	const { setAlerts } = useContext(AlertContext);
	const [error, setError] = useState<ApiError | null>(null);

	// Store an enrollment that receives user mutations.
	// This should be updated when the user clicks Save,
	// applying the mutations to this local copy.
	// We then send the mutatedEnrollment to the API.
	const [mutatedEnrollment, setMutatedEnrollment] = useState<Enrollment | null>(null);

	// These are used in get and put
	const commonParams:
		| ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGetRequest
		| ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest = {
		id: enrollmentId,
		orgId: getIdForUser(user, 'org'),
		siteId: siteId,
	};

	const { error: errorOnGet, data: enrollment } = useApi<Enrollment>(
		(api) =>
			api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGet({
				...commonParams,
				include: ['child', 'family', 'determinations', 'fundings', 'sites'],
			}),
		{ skip: !user }
	);
	useEffect(() => {
		if (errorOnGet) {
			setError(errorOnGet);
		}
		if (enrollment) {
			setMutatedEnrollment(enrollment);
		}
	}, [errorOnGet, enrollment]);

	const { fundings, site } = mutatedEnrollment || {};
	const cdcFunding = getCurrentCdcFunding(fundings || []);

	// Tracks whether to show client errors. On first load, we don't show errors,
	// because the user hasn't had chance to do anything
	const [attemptedSave, setAttemptedSave] = useState(false);
	// Determines when to run "mutate" effect
	const [attemptingSave, setAttemptingSave] = useState(false);

	const isMissingInformation = hasValidationErrors(mutatedEnrollment);
	// If the enrollment is missing information, navigate to that enrollment so user can fix it
	useEffect(() => {
		if (isMissingInformation) {
			setAlerts([missingInformationForWithdrawalAlert]);
			history.push(`/roster/sites/${siteId}/enrollments/${enrollmentId}`);
		}
	}, [isMissingInformation, siteId, enrollmentId, history, setAlerts]);

	// set up PUT request to be triggered on save attempt
	const { error: errorOnSave, data: returnedEnrollment } = useApi<Enrollment>(
		(api) =>
			api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPut({
				...commonParams,
				enrollment: mutatedEnrollment || undefined,
			}),
		{
			skip: !attemptingSave,
			callback: () => setAttemptingSave(false),
		}
	);
	const errorAlertState = useCatchallErrorAlert(error);
	useFocusFirstError([error]);

	useEffect(() => {
		// If the withdraw request went through, then return to the roster
		if (returnedEnrollment && !errorOnSave && site) {
			setAlerts([childWithdrawnAlert(nameFormatter(returnedEnrollment.child), site.name || '')]);
			history.push(`/roster`);
		} else {
			// Otherwise handle the error
			setError(errorOnSave);
		}
	}, [returnedEnrollment, errorOnSave, history, setAlerts, setError, site]);

	if (!mutatedEnrollment || !site) {
		return <div className="Withdrawal"></div>;
	}

	const onFormSubmit = (userModifiedEnrollment: Enrollment) => {
		const { exit: enrollmentEndDate } = userModifiedEnrollment;
		if (!attemptedSave) {
			// Only need to update this the first time the user tries to save
			setAttemptedSave(true);
		}
		if (enrollmentEndDate) {
			// The enrollment end date is verified on the client side because it's how we
			// know we're attempting a withdrawal. If we set the attempting save variable
			// without an end date, then it won't get unset, because the request won't hit
			// the server, and the callback won't be called
			setAttemptingSave(true);
			setMutatedEnrollment(userModifiedEnrollment);
		}
	};

	return (
		<CommonContainer
			directionalLinkProps={{
				direction: 'left',
				to: `/roster/sites/${siteId}/enrollments/${enrollment.id}`,
				text: 'Back',
			}}
		>
			<div className="grid-container">
				<h1>Withdraw {nameFormatter(mutatedEnrollment.child)}</h1>
				<div className="grid-row grid-gap oec-enrollment-details-section__content margin-top-1">
					<div className="mobile-lg:grid-col-6">
						<p>{site.name}</p>
						<p>Age: {splitCamelCase(mutatedEnrollment.ageGroup, '/')}</p>
						<p>Enrollment date: {dateFormatter(mutatedEnrollment.entry)}</p>
					</div>
					{cdcFunding && (
						<div className="mobile-lg:grid-col-6">
							<p>
								{getFundingTag({
									fundingSource: cdcFunding.source,
								})}
							</p>
							<p>Enrollment: {prettyFundingSpaceTime(cdcFunding.fundingSpace)}</p>
							<p>
								First reporting period:{' '}
								{cdcFunding.firstReportingPeriod
									? reportingPeriodFormatter(cdcFunding.firstReportingPeriod)
									: InlineIcon({ icon: 'attentionNeeded' })}
							</p>
						</div>
					)}
				</div>

				<Form<Enrollment>
					data={mutatedEnrollment}
					onSubmit={onFormSubmit}
					className=""
					noValidate
					autoComplete="off"
				>
					<div className="grid-row grid-gap">
						<div className="mobile-lg:grid-col-12">
							<EnrollmentEndDateField
								attemptedSave={attemptedSave}
								errorAlertState={errorAlertState}
								error={error}
							/>
							<ExitReasonField errorAlertState={errorAlertState} error={error} />
							{cdcFunding && (
								<LastReportingPeriodField errorAlertState={errorAlertState} error={error} />
							)}
						</div>
					</div>
					<div className="grid-row">
						<div className="grid-col-auto">
							<Button
								text="Cancel"
								href={`/roster/sites/${siteId}/enrollments/${enrollment.id}/`}
								appearance="outline"
							/>
							<FormSubmitButton
								text={attemptingSave ? 'Withdrawing...' : 'Confirm and withdraw'}
								disabled={isMissingInformation || attemptingSave}
							/>
						</div>
					</div>
				</Form>
			</div>
		</CommonContainer>
	);
}
