import React, { useEffect, useState } from 'react';
import FormContext, { useGenericContext } from '../../../../../../components/Form_New/FormContext';
import { Enrollment, ReportingPeriod } from '../../../../../../generated';
import { useContext } from 'react';
import ReportingPeriodContext from '../../../../../../contexts/ReportingPeriod/ReportingPeriodContext';
import {
	reportingPeriodFormatter,
	getIdForUser,
	getNextFunding,
} from '../../../../../../utils/models';
import { Select, SelectProps } from '../../../../../../components';
import moment from 'moment';
import { FormField } from '../../../../../../components/Form_New';
import { FundingReportingPeriodFieldProps } from '../common';
import produce from 'immer';
import set from 'lodash/set';
import UserContext from '../../../../../../contexts/User/UserContext';
import useApi from '../../../../../../hooks/useApi';
import { propertyDateSorter } from '../../../../../../utils/dateSorter';

type LastReportingPeriodFieldProps = FundingReportingPeriodFieldProps & {
	nextEnrollmentFundingFirstReportingPeriodId?: number | null;
	label?: string;
};

/**
 * This component is used in EnrollmentUpdate, when creating a new enrollment,
 * to end any current fundings on the previously current enrollment. It bounds
 * reporting period options on the enrollment end date, and the next enrollment
 * funding's first reporting period (if exists).
 *
 * The selection gets unset when the next enrollment funding's first reporting
 * period changes to ensure the user does not accidentally submit invalid data
 * (e.g. where the previous enrollment funding last reporting period is after the new
 * enrollment funding first reporting period)
 */
export const LastReportingPeriodField: React.FC<LastReportingPeriodFieldProps> = ({
	fundingId,
	nextEnrollmentFundingFirstReportingPeriodId,
	label,
}) => {
	const { dataDriller, updateData } = useGenericContext<Enrollment>(FormContext);
	const { cdcReportingPeriods: reportingPeriods } = useContext(ReportingPeriodContext);
	const nextEnrollmentFundingFirstReportingPeriod = reportingPeriods.find(
		(period) => period.id === nextEnrollmentFundingFirstReportingPeriodId
	);
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

	const endDate = dataDriller.at('exit').value;
	const lastReportingPeriod = dataDriller
		.at('fundings')
		.find((f) => f.id === fundingId)
		.at('lastReportingPeriod').value;
	const nextFunding = getNextFunding(dataDriller.value, fundingId);
	useEffect(() => {
		if (!reportingPeriods) return;

		// If the last reporting period exists, and is before or same as most recently submitted report,
		// then the last reporting period is not editable, and current value is only option
		if (
			lastReportingPeriod &&
			mostRecentlySubmittedReport &&
			lastReportingPeriod.period <= mostRecentlySubmittedReport.reportingPeriod.period
		) {
			setValidReportingPeriods(
				reportingPeriods.filter((period) => period.id === lastReportingPeriod.id)
			);
			return;
		}

		// Otherwise, valid reporting periods:
		// - start on or before enrollment end date
		// - are before next funding's first reporting period (either this enrollment, or next enrollment)
		// - are centered around the existing value, or today (for relevnce & improved user experience)
		// - start on or after first reporting period
		const existingValueOrToday = moment.utc(lastReportingPeriod?.periodStart).add(2, 'months');
		const maxStartDatesToCompare = [existingValueOrToday];
		if (endDate) {
			maxStartDatesToCompare.push(moment.utc(endDate));
		}
		if (nextFunding && nextFunding.firstReportingPeriod) {
			maxStartDatesToCompare.push(moment.utc(nextFunding.firstReportingPeriod.periodStart));
		}
		if (nextEnrollmentFundingFirstReportingPeriod) {
			maxStartDatesToCompare.push(
				moment.utc(nextEnrollmentFundingFirstReportingPeriod.periodStart)
			);
		}

		const maxPeriodStartDate = moment.min(maxStartDatesToCompare);
		const startIdx = reportingPeriods.findIndex((period) =>
			moment.utc(period.periodStart).isSameOrAfter(maxPeriodStartDate)
		);

		const _validReportingPeriods = reportingPeriods.slice(startIdx - 4, startIdx);
		setValidReportingPeriods(_validReportingPeriods);
	}, [endDate, lastReportingPeriod, nextFunding, mostRecentlySubmittedReport]);

	// If next enrollment funding first reporting period changes, unset last reporting period selection
	const lastReportingPeriodIdAccessor = dataDriller
		.at('fundings')
		.find((f) => f.id === fundingId)
		.at('lastReportingPeriodId');
	useEffect(() => {
		if (lastReportingPeriodIdAccessor.value && nextEnrollmentFundingFirstReportingPeriodId) {
			updateData((_data) =>
				produce<Enrollment>(_data, (draft) =>
					set(draft, lastReportingPeriodIdAccessor.path, undefined)
				)
			);
		}
	}, [nextEnrollmentFundingFirstReportingPeriodId]);

	return (
		<FormField<Enrollment, SelectProps, number | null>
			key={`${lastReportingPeriodIdAccessor.value}`}
			getValue={(data) =>
				data
					.at('fundings')
					.find((funding) => funding.id === fundingId)
					.at('lastReportingPeriodId')
			}
			parseOnChangeEvent={(e) => parseInt((e.target as HTMLInputElement).value)}
			inputComponent={Select}
			id="last-reporting-period"
			label={label || 'Last reporting period'}
			options={validReportingPeriods.map((period) => ({
				value: `${period.id}`,
				text: reportingPeriodFormatter(period, { extended: true }),
			}))}
		/>
	);
};
