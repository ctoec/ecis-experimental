import React, { useState, useEffect, useContext } from 'react';
import { Enrollment, ReportingPeriod } from '../../../../../../generated';
import ReportingPeriodContext from '../../../../../../contexts/ReportingPeriod/ReportingPeriodContext';
import moment from 'moment';
import { SelectProps, Select, FormField, useGenericContext, FormContext } from '@ctoec/component-library';
import {
	reportingPeriodFormatter,
	getIdForUser,
	getPreviousFunding,
} from '../../../../../../utils/models';
import { displayValidationStatus } from '../../../../../../utils/validations/displayValidationStatus';
import { REQUIRED_FOR_OEC_REPORTING } from '../../../../../../utils/validations/messageStrings';
import { FundingReportingPeriodFieldProps } from '../common';
import useApi from '../../../../../../hooks/useApi';
import UserContext from '../../../../../../contexts/User/UserContext';
import { propertyDateSorter } from '../../../../../../utils/dateSorter';

type FirstReportingPeriodFieldProps = FundingReportingPeriodFieldProps & {
	setExternalFirstReportingPeriod?: React.Dispatch<React.SetStateAction<number | undefined>>;
};

/**
 * This component is used in EnrollmentNew and EnrollmentUpdate when a new funding is created,
 * or whenever an existing funding is edited. It accepts an optional function to update an external
 * number state variable, for instances when the value of the funding's first reporting period
 * affects state outside of the funding form (specifically, when creating a new funding: the first
 * reporting period will limit the valid options for a previously existing funding's last reporting
 * period)
 */
export const FirstReportingPeriodField: React.FC<FirstReportingPeriodFieldProps> = ({
	fundingId,
	error,
	errorAlertState,
	setExternalFirstReportingPeriod,
}) => {
	const { dataDriller } = useGenericContext<Enrollment>(FormContext);
	const { cdcReportingPeriods: reportingPeriods } = useContext(ReportingPeriodContext);
	const [validReportingPeriods, setValidReportingPeriods] = useState<ReportingPeriod[]>([]);

	// Get reports
	const { user } = useContext(UserContext);
	const { data: reports } = useApi((api) =>
		api.apiOrganizationsOrgIdReportsGet({ orgId: getIdForUser(user, 'org') })
	);

	// Get most recently submitted report to use to bound valid reporting period options
	const [mostRecentlySubmittedReport] = (reports || [])
		.filter((report) => !!report.submittedAt)
		.sort((a, b) => propertyDateSorter(a, b, (r) => r.submittedAt, true));

	const startDate = dataDriller.at('entry').value;
	const firstReportingPeriod = dataDriller
		.at('fundings')
		.find((f) => f.id === fundingId)
		.at('firstReportingPeriod').value;
	const previousFunding = getPreviousFunding(dataDriller.value, fundingId);
	useEffect(() => {
		if (!reportingPeriods) return;

		// If the first reporting period exists, and is before or same as most recently submitted report,
		// then the first reporting period is not editable, and current value is only option
		if (
			firstReportingPeriod &&
			mostRecentlySubmittedReport &&
			firstReportingPeriod.period <= mostRecentlySubmittedReport.reportingPeriod.period
		) {
			setValidReportingPeriods(
				reportingPeriods.filter((period) => period.id === firstReportingPeriod.id)
			);
			return;
		}

		// Otherwise, valid reporting periods:
		// - end on or after the enrollment start date
		// - are after the most recent reporting period for which there is a submitted report
		// - if previous funding exists, are after last reporting of previous funding
		// - are centered around the existing value, or today (for relevance & improved user experience)
		const existingValueOrToday = moment.utc(firstReportingPeriod?.periodEnd).add(-2, 'months'); // add -2 months to existing value or today so user gets 2 options before and after the date
		const minEndDatesToCompare = [moment.utc(startDate), existingValueOrToday];
		if (mostRecentlySubmittedReport) {
			minEndDatesToCompare.push(moment.utc(mostRecentlySubmittedReport.reportingPeriod.periodEnd));
		}
		if (previousFunding && previousFunding.lastReportingPeriod) {
			minEndDatesToCompare.push(moment.utc(previousFunding.lastReportingPeriod.periodEnd));
		}

		const minPeriodEndDate = moment.max(minEndDatesToCompare);
		const startIdx = reportingPeriods.findIndex((period) =>
			moment.utc(period.periodEnd).isSameOrAfter(minPeriodEndDate)
		);

		// Show the user 5 reporting period options, starting from the minimum end date
		const _validReportingPeriods = reportingPeriods.slice(startIdx, startIdx + 4);
		setValidReportingPeriods(_validReportingPeriods);
	}, [startDate, firstReportingPeriod, previousFunding, mostRecentlySubmittedReport]);

	return (
		<FormField<Enrollment, SelectProps, number | null>
			getValue={(data) =>
				data
					.at('fundings')
					.find((f) => f.id === fundingId)
					.at('firstReportingPeriodId')
			}
			parseOnChangeEvent={(e) => {
				const reportingPeriodId = parseInt((e.target as HTMLInputElement).value);
				if (setExternalFirstReportingPeriod && reportingPeriodId) {
					setExternalFirstReportingPeriod(reportingPeriodId);
				}
				return reportingPeriodId;
			}}
			inputComponent={Select}
			id={`first-reporting-period-${fundingId}`}
			label="First reporting period"
			options={validReportingPeriods.map((period) => ({
				text: reportingPeriodFormatter(period, { extended: true }),
				value: `${period.id}`,
			}))}
			status={(_) =>
				displayValidationStatus([
					{
						type: 'error',
						response: error,
						field: 'fundings.firstReportingPeriodId',
						message: REQUIRED_FOR_OEC_REPORTING,
						errorAlertState,
					},
				])
			}
		/>
	);
};
