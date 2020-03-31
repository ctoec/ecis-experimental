import React, { useContext, useReducer, useState, useEffect } from 'react';
import { History } from 'history';
import UserContext from '../../contexts/User/UserContext';
import {
	Enrollment,
	Funding,
	ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGetRequest,
	ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest,
	ValidationProblemDetails,
	C4KCertificate,
} from '../../generated';
import { nameFormatter, splitCamelCase, childWithdrawnAlert } from '../../utils/stringFormatters';
import {
	enrollmentExitReasons,
	currentCdcFunding,
	currentC4kCertificate,
	lastNReportingPeriods,
	reportingPeriodFormatter,
	prettyFundingTime,
	validatePermissions,
	getIdForUser,
} from '../../utils/models';
import useNewUseApi, { ApiError } from '../../hooks/newUseApi';
import { FormReducer, formReducer, updateData } from '../../utils/forms/form';
import { DeepNonUndefineable, DeepNonUndefineableArray } from '../../utils/types';
import ReportingPeriodContext from '../../contexts/ReportingPeriod/ReportingPeriodContext';
import {
	useFocusFirstError,
	hasValidationErrors,
	isBlockingValidationError,
	serverErrorForField,
	clientErrorForField,
} from '../../utils/validations';
import AlertContext from '../../contexts/Alert/AlertContext';
import {
	validationErrorAlert,
	missingInformationForWithdrawalAlert,
} from '../../utils/stringFormatters/alertTextMakers';
import moment from 'moment';
import CommonContainer from '../CommonContainer';
import { InlineIcon, DateInput, ChoiceList, Button } from '../../components';
import { processBlockingValidationErrors } from '../../utils/validations/processBlockingValidationErrors';
import dateFormatter from '../../utils/dateFormatter';
import { generateFundingTypeTag } from '../../utils/fundingType';

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
	const { cdcReportingPeriods: reportingPeriods } = useContext(ReportingPeriodContext);

	// Set request params as  a state var so that we only attempt to run queries once we have them
	const [requestParams, setRequestParams] = useState<
		ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGetRequest
	>();
	useEffect(() => {
		if (!enrollmentId || !user || !siteId) {
			return;
		}
		if (!validatePermissions(user, 'site', siteId)) {
			throw new Error('User is not authorized');
		}
		setRequestParams({
			// These are used in get and put
			id: enrollmentId,
			orgId: getIdForUser(user, 'org'),
			siteId: siteId,
		});
	}, [enrollmentId, user, siteId]);

	const { error: getRequestError, data: getRequestData } = useNewUseApi<Enrollment>(
		api =>
			api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGet({
				...requestParams,
				include: ['child', 'family', 'determinations', 'fundings', 'sites'],
			} as ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGetRequest),
		{ skip: !requestParams }
	);

	const [enrollment, updateEnrollment] = useReducer<FormReducer<DeepNonUndefineable<Enrollment>>>(
		formReducer,
		getRequestData
	);
	const updateFormData = updateData<DeepNonUndefineable<Enrollment>>(updateEnrollment);

	useEffect(() => {
		// When get data has changed, update the enrollment to not be empty
		updateEnrollment(getRequestData);
	}, [getRequestData]);

	const { exit: enrollmentEndDate, exitReason, site } = enrollment || {};

	// set up supporting data contexts
	const [reportingPeriodOptions, setReportingPeriodOptions] = useState(reportingPeriods);
	useEffect(() => {
		if (reportingPeriods) {
			setReportingPeriodOptions(
				lastNReportingPeriods(reportingPeriods, enrollmentEndDate || moment().toDate(), 5)
			);
		}
	}, [reportingPeriods, enrollmentEndDate]);

	// set up form state
	const [error, setError] = useState<ApiError | null>(getRequestError);
	const [hasAlertedOnError, setHasAlertedOnError] = useState(false);
	const [attemptedSave, setAttemptedSave] = useState(false); // Only matters once for sake of not showing client errors on first load, before user has a chance to do anything
	const [attemptingSave, setAttemptingSave] = useState(false); // Matters when deciding to run "mutate" effect
	useFocusFirstError([error]);

	// set up convenience derived variables
	const isMissingInformation = hasValidationErrors(enrollment);
	// If the enrollment is missing information, navigate to that enrollment so user can fix it
	useEffect(() => {
		if (isMissingInformation) {
			setAlerts([missingInformationForWithdrawalAlert]);
			history.push(`/roster/sites/${siteId}/enrollments/${enrollment.id}`);
		}
	}, [enrollment, isMissingInformation, history, setAlerts, siteId]);

	const fundings =
		enrollment && enrollment.fundings
			? enrollment.fundings
			: ([] as DeepNonUndefineableArray<Funding>);
	const cdcFunding = currentCdcFunding(fundings);
	const c4KFunding = currentC4kCertificate(enrollment);

	const { lastReportingPeriod } = cdcFunding || {};

	const setLastReportingPeriod = (lastReportingPeriodId: number) => {
		let updatedFundings: Funding[] = fundings;
		if (cdcFunding) {
			updatedFundings = [
				...updatedFundings.filter(f => f.id !== cdcFunding.id),
				{
					...cdcFunding,
					lastReportingPeriodId: lastReportingPeriodId,
				},
			];
			updateEnrollment({
				...enrollment,
				fundings: updatedFundings as DeepNonUndefineableArray<Funding>,
			});
		}
		if (c4KFunding) {
			let c4KCertificates: C4KCertificate[] = enrollment.child
				? enrollment.child.c4KCertificates || []
				: [];
			c4KCertificates = [
				...c4KCertificates.filter(cert => cert.id !== c4KFunding.id),
				{
					...c4KFunding,
					endDate: enrollmentEndDate,
				},
			];
			updateEnrollment({
				...enrollment,
				child: {
					...enrollment.child,
					c4KCertificates: c4KCertificates as DeepNonUndefineable<C4KCertificate[]>,
				},
			});
		}
	};

	// set up PUT request to be triggered on save attempt
	const { error: putRequestError, data: putRequestData } = useNewUseApi<Enrollment>(
		api =>
			api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPut({
				...requestParams,
				enrollment,
			} as ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest),
		{
			skip: !attemptingSave || !requestParams || !enrollmentEndDate,
			callback: () => setAttemptingSave(false),
		}
	);

	useEffect(() => {
		// If the withdraw request went through, then return to the roster
		if (putRequestData && !putRequestError) {
			setAlerts([childWithdrawnAlert(nameFormatter(enrollment.child))]);
			history.push(`/roster`);
		}

		// Otherwiwe handle the error
		setError(putRequestError);
		if (putRequestError && !hasAlertedOnError) {
			if (!isBlockingValidationError(putRequestError)) {
				throw new Error(putRequestError.title || 'Unknown api error');
			}
			setAlerts([validationErrorAlert]);
		}
	}, [putRequestData, putRequestError]);

	// save function
	const save = () => {
		if (!attemptedSave) {
			// Only need to mess with this the first time
			setAttemptedSave(true);
		}
		if (enrollmentEndDate) {
			// The enrollment end date is verified on the client side because it's how we know we're attempting a withdrawal
			// If we set the attempting save variable without an end date, then it won't get unset, because the request won't hit the server, and the callback won't be called
			setAttemptingSave(true);
		}
	};

	if (!enrollment || !site) {
		return <div className="Withdrawal"></div>;
	}

	return (
		<CommonContainer
			directionalLinkProps={{
				direction: 'left',
				to: `/roster/sites/${siteId}/enrollments/${enrollment.id}`,
				text: 'Back',
			}}
		>
			<div className="grid-container">
				<h1>Withdraw {nameFormatter(enrollment.child)}</h1>
				<div className="grid-row grid-gap oec-enrollment-details-section__content margin-top-1">
					<div className="mobile-lg:grid-col-6">
						<p>{site.name}</p>
						<p>Age: {splitCamelCase(enrollment.ageGroup, '/')}</p>
						<p>Enrollment date: {dateFormatter(enrollment.entry)}</p>
					</div>
					{cdcFunding && (
						<div className="mobile-lg:grid-col-6">
							<p>{generateFundingTypeTag({ ...cdcFunding, type: 'CDC' })}</p>
							<p>Enrollment: {prettyFundingTime(cdcFunding.time)}</p>
							<p>
								First reporting period:{' '}
								{cdcFunding.firstReportingPeriod
									? reportingPeriodFormatter(cdcFunding.firstReportingPeriod)
									: InlineIcon({ icon: 'attentionNeeded' })}
							</p>
						</div>
					)}
				</div>

				<div className="use-form mobile-lg:grid-col-12">
					<DateInput
						label="Enrollment end date"
						id="enrollment-end-date"
						name="exit"
						onChange={updateFormData(newDate => newDate.toDate())}
						date={enrollmentEndDate ? moment(enrollmentEndDate) : undefined}
						status={
							// TODO should we use a different fact for this condition?
							reportingPeriodOptions.length === 0
								? {
										type: 'error',
										id: 'last-reporting-period-error',
										message:
											'ECE Reporter only contains data for fiscal year 2020 and later. Please do not add children who withdrew prior to July 2019.',
								  }
								: error &&
								  processBlockingValidationErrors(
										'exit',
										(error as ValidationProblemDetails).errors
								  )
								? serverErrorForField(hasAlertedOnError, setHasAlertedOnError, 'exit', error)
								: clientErrorForField(
										'exit',
										enrollmentEndDate,
										attemptedSave,
										'This information is required for withdrawal'
								  )
						}
					/>
					<ChoiceList
						type="select"
						label="Reason"
						id="exit-reason"
						options={Object.entries(enrollmentExitReasons).map(([key, reason]) => ({
							value: key,
							text: reason,
						}))}
						selected={exitReason ? [exitReason] : undefined}
						otherInputLabel="Other"
						name="exitReason"
						onChange={updateFormData()}
						status={serverErrorForField(
							hasAlertedOnError,
							setHasAlertedOnError,
							'exitReason',
							error,
							'This information is required for withdrawal'
						)}
					/>
					{cdcFunding && (
						<ChoiceList
							type="select"
							label="Last reporting period"
							id="last-reporting-period"
							options={reportingPeriodOptions.map(period => ({
								value: '' + period.id,
								text: reportingPeriodFormatter(period, { extended: true }),
							}))}
							onChange={event => {
								const newReportingPeriodId = parseInt(event.target.value);
								setLastReportingPeriod(newReportingPeriodId);
							}}
							status={serverErrorForField(
								hasAlertedOnError,
								setHasAlertedOnError,
								'fundings',
								error,
								// if last reporting period exists, then the value is invalid
								// so do not display required information copy
								lastReportingPeriod ? undefined : 'This information is required for withdrawal'
							)}
						/>
					)}
				</div>

				<div className="grid-row margin-y-6">
					<div className="mobile-lg:grid-col-auto">
						<Button
							text="Cancel"
							href={`/roster/sites/${siteId}/enrollments/${enrollment.id}/`}
							appearance="outline"
						/>
					</div>
					<div className="mobile-lg:grid-col-auto padding-left-2">
						<Button
							text={attemptingSave ? 'Withdrawing...' : 'Confirm and withdraw'}
							onClick={save}
							disabled={isMissingInformation || attemptingSave}
						/>
					</div>
				</div>
			</div>
		</CommonContainer>
	);
}
