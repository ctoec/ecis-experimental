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

	// set up initial form data
	const requestParams = {
		id: enrollmentId || 0,
		orgId: getIdForUser(user, 'org'),
		siteId: validatePermissions(user, 'site', siteId) ? siteId : 0,
	};

	const [getLoading, getError, getData] = useNewUseApi<Enrollment>(
		api =>
			api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGet({
				...requestParams,
				include: ['child', 'family', 'determinations', 'fundings', 'sites'],
			}),
		{ skip: !enrollmentId || !user }
	);

	const [enrollment, updateEnrollment] = useReducer<FormReducer<DeepNonUndefineable<Enrollment>>>(
		formReducer,
		getData
	);

	useEffect(() => {
		// When get data has changed, update the enrollment to not be empty
		updateEnrollment(getData)
	}, [getData])

	// set up form variables and update functions
	const updateFormData = updateData<DeepNonUndefineable<Enrollment>>(updateEnrollment);

	const { exit: enrollmentEndDate, exitReason } = enrollment || {};
	const [lastReportingPeriod, setLastReportingPeriod] = useState<ReportingPeriod>();

	// set up supporting data contexts
	const { cdcReportingPeriods: reportingPeriods } = useContext(ReportingPeriodContext);
	const [reportingPeriodOptions, setReportingPeriodOptions] = useState(reportingPeriods);
	useEffect(() => {
		if (reportingPeriods) {
			setReportingPeriodOptions(
				lastNReportingPeriods(reportingPeriods, enrollmentEndDate || moment().toDate(), 5)
			);
		}
	}, [reportingPeriods, enrollmentEndDate]);

	// set up form state
	const [loading, setLoading] = useState(getLoading);
	const [error, setError] = useState<ApiError | null>(getError);
	const [hasAlertedOnError, setHasAlertedOnError] = useState(false);
	const [attempedSave, setAttempedSave] = useState(false);
	useFocusFirstError([error]);

	// set up convenience derived variables
	const isMissingInformation = hasValidationErrors(enrollment);
	const fundings =
		enrollment && enrollment.fundings
			? enrollment.fundings
			: ([] as DeepNonUndefineableArray<Funding>);
	const cdcFunding = currentCdcFunding(fundings);

	// set up PUT request to be triggered on save attempt
	const [putLoading, putError, putData] = useNewUseApi<Enrollment>(
		api =>
			api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPut({
				...requestParams,
				enrollment,
			}),
		{ skip: !attempedSave }
	);
	useEffect(() => {
		setLoading(putLoading);
		setError(putError);
		updateEnrollment(putData);
	}, [putLoading, putError, putData]);

	// handle PUT request
	useEffect(() => {
		if (!attempedSave) {
			return;
		}

		if (loading) {
			return;
		}

		if (!error) {
			setAlerts([childWithdrawnAlert(nameFormatter(enrollment.child))]);
			history.push(`/roster`);
			return;
		}

		if (!hasAlertedOnError) {
			if (!isBlockingValidationError(error)) {
				throw new Error(error.title || 'Unknown api error');
			}
			setAlerts([validationErrorAlert]);
		}
	}, [attempedSave, loading, error, enrollment, hasAlertedOnError, setAlerts]);

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

		// TODO: should we be doing this?
		// given that we're back to treating c4k certs as valid for one year,
		// I'm thinking not
		// const c4kFunding = currentC4kFunding(fundings);
		// if(c4kFunding) {
		// 	updatedFundings = [
		// 		...updatedFundings.filter(f => f.id != c4kFunding.id),
		// 		{
		// 			...c4kFunding,
		// 			certificateEndDate: enrollmentEndDate,
		// 		}
		// 	];
		// }

		enrollment.fundings = updatedFundings as DeepNonUndefineableArray<Funding>;
		setAttempedSave(true);
	};

	if (loading || !enrollment) {
		console.log('empty div');
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
						<p>{enrollment.site.name}</p>
						<p>Age: {splitCamelCase(enrollment.ageGroup, '/')}</p>
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
							reportingPeriodOptions.length === 0
								? {
										type: 'error',
										id: 'last-reporting-period-error',
										message:
											'ECE Reporting only contains data for fiscal year 2020 and later. Please do not add children who withdrew prior to July 2019.',
								  }
								: serverErrorForField(
										hasAlertedOnError,
										setHasAlertedOnError,
										'exit',
										error,
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
						<Button text="Confirm and withdraw" onClick={save} disabled={isMissingInformation} />
					</div>
				</div>
			</div>
		</CommonContainer>
	);
}
