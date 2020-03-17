import React, { useContext, useReducer, useState, useEffect } from 'react';
import { History } from 'history';
import UserContext from '../../contexts/User/UserContext';
import {
	getIdForUser,
	validatePermissions,
	currentCdcFunding,
	currentC4kFunding,
	lastNReportingPeriods,
	reportingPeriodFormatter,
	enrollmentExitReasons,
} from '../../utils/models';
import useNewUseApi, { ApiError } from '../../hooks/newUseApi';
import { Enrollment, ReportingPeriod, Funding, ValidationProblemDetails } from '../../generated';
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
import { childWithdrawnAlert, nameFormatter, splitCamelCase } from '../../utils/stringFormatters';
import AlertContext from '../../contexts/Alert/AlertContext';
import { validationErrorAlert } from '../../utils/stringFormatters/alertTextMakers';
import moment from 'moment';
import CommonContainer from '../CommonContainer';
import { InlineIcon, DateInput, ChoiceList, Button } from '../../components';
import { processBlockingValidationErrors } from '../../utils/validations/processBlockingValidationErrors';

type WithdrawalProps = {
	history: History;
	match: {
		params: {
			siteId: number;
			enrollmentId: number;
		};
	};
};

export default function NewWithdrawal({
	history,
	match: {
		params: { siteId, enrollmentId },
	},
}: WithdrawalProps) {
	const { user } = useContext(UserContext);
	const { setAlerts } = useContext(AlertContext);
	const { cdcReportingPeriods: reportingPeriods } = useContext(ReportingPeriodContext);

	// Set request params as  a state var so that we only attempt to run queries once we have them
	const [requestParams, setRequestParams] = useState();
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

	const [getError, getData] = useNewUseApi<Enrollment>(
		api =>
			api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGet({
				...requestParams,
				include: ['child', 'family', 'determinations', 'fundings', 'sites'],
			}),
		{ skip: !requestParams }
	);

	const [enrollment, updateEnrollment] = useReducer<FormReducer<DeepNonUndefineable<Enrollment>>>(
		formReducer,
		getData
	);
	const updateFormData = updateData<DeepNonUndefineable<Enrollment>>(updateEnrollment);

	useEffect(() => {
		// When get data has changed, update the enrollment to not be empty
		updateEnrollment(getData);
	}, [getData]);

	const { exit: enrollmentEndDate, exitReason, site } = enrollment || {};
	const [lastReportingPeriod, setLastReportingPeriod] = useState<ReportingPeriod>();

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
	const [error, setError] = useState<ApiError | null>(getError);
	const [hasAlertedOnError, setHasAlertedOnError] = useState(false);
	const [attemptedSave, setAttemptedSave] = useState(false); // Only matters once for sake of not showing client errors on first load, before user has a chance to do anything
	const [attemptingSave, setAttemptingSave] = useState(false); // Matters when deciding to run "mutate" effect
	useFocusFirstError([error]);

	// set up convenience derived variables
	const isMissingInformation = hasValidationErrors(enrollment);
	const fundings =
		enrollment && enrollment.fundings
			? enrollment.fundings
			: ([] as DeepNonUndefineableArray<Funding>);
	const cdcFunding = currentCdcFunding(fundings);

	// set up PUT request to be triggered on save attempt
	const [putError, putData] = useNewUseApi<Enrollment>(
		api =>
			api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPut({
				...requestParams,
				enrollment,
			}),
		{
			skip: !attemptingSave || !requestParams || !enrollmentEndDate,
			callback: () => setAttemptingSave(false),
		}
	);

	useEffect(() => {
		setError(putError);
		if (putError && !hasAlertedOnError) {
			if (!isBlockingValidationError(putError)) {
				throw new Error(putError.title || 'Unknown api error');
			}
			setAlerts([validationErrorAlert]);
		}
	}, [putError]);

	useEffect(() => {
		// If the withdraw request went through, then return to the roster
		if (putData && !putError) {
			setAlerts([childWithdrawnAlert(nameFormatter(enrollment.child))]);
			history.push(`/roster`);
		}
	}, [putData]);

	// save function
	const save = () => {
		// handle enrollment updates that are not handled by form reducer updates
		let updatedFundings: Funding[] = fundings;
		if (cdcFunding && lastReportingPeriod) {
			updatedFundings = [
				...updatedFundings.filter(f => f.id !== cdcFunding.id),
				{
					...cdcFunding,
					lastReportingPeriodId: lastReportingPeriod.id,
				},
			];
		}

		updateEnrollment({
			...enrollment,
			fundings: updatedFundings as DeepNonUndefineableArray<Funding>,
		});

		if (!attemptedSave) {
			// Only need to mess with this the first time
			setAttemptedSave(true);
		}

		// TODO: should we separate this from the fundings logic in case the enrollment state update doesn't finish in time?
		if (enrollmentEndDate) {
			// Only do this if we're actually going to hit the server-- otherwise it doesn't get unset when we show the client error
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
						{/* TODO: USE DATE FORMATTER */}
						<p>Enrollment date: {enrollment.entry && enrollment.entry.toLocaleDateString()}</p>
					</div>
					{cdcFunding && (
						<div>
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
								const chosen = reportingPeriods.find<ReportingPeriod>(
									period => period.id === parseInt(event.target.value)
								);
								setLastReportingPeriod(chosen);
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
