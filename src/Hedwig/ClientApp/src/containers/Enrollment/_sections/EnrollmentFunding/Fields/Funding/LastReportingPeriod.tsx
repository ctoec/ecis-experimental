import React, { useEffect } from 'react';
import FormContext, { useGenericContext } from '../../../../../../components/Form_New/FormContext';
import { Enrollment } from '../../../../../../generated';
import { useContext } from 'react';
import ReportingPeriodContext from '../../../../../../contexts/ReportingPeriod/ReportingPeriodContext';
import { lastNReportingPeriods, reportingPeriodFormatter } from '../../../../../../utils/models';
import { Select, SelectProps } from '../../../../../../components';
import moment from 'moment';
import { FormField } from '../../../../../../components/Form_New';
import { FundingReportingPeriodFieldProps } from '../common';
import produce from 'immer';
import set from 'lodash/set';

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
	const { data, dataDriller, updateData } = useGenericContext<Enrollment>(FormContext);
	const { cdcReportingPeriods } = useContext(ReportingPeriodContext);
	const nextEnrollmentFundingFirstReportingPeriod = cdcReportingPeriods.find(
		(period) => period.id === nextEnrollmentFundingFirstReportingPeriodId
	);

	// Last reporting period has to start on or before end date,
	const currentEndDate = dataDriller.at('exit').value;
	let reportingPeriodOptions = lastNReportingPeriods(
		cdcReportingPeriods,
		currentEndDate || moment.utc().toDate(),
		5
	);

	// And must be after (or same as) first reporting period
	const firstReportingPeriod = dataDriller
		.at('fundings')
		.find((funding) => funding.id === fundingId)
		.at('firstReportingPeriod').value;

	reportingPeriodOptions = reportingPeriodOptions.filter(
		(period) => period.period >= firstReportingPeriod.period
	);

	// and before next enrollment funding's first reporting period,
	// if one exists
	if (nextEnrollmentFundingFirstReportingPeriod) {
		reportingPeriodOptions = reportingPeriodOptions.filter(
			(period) => period.period < nextEnrollmentFundingFirstReportingPeriod.period
		);
	}

	const lastReportingPeriodId = dataDriller
		.at('fundings')
		.find((funding) => funding.id === fundingId)
		.at('lastReportingPeriodId');

	// If next enrollment funding first reporting period changes, unset last reporting period selection
	useEffect(() => {
		if (lastReportingPeriodId.value) {
			updateData((_data) =>
				produce<Enrollment>(_data, (draft) => set(draft, lastReportingPeriodId.path, undefined))
			);
		}
	}, [nextEnrollmentFundingFirstReportingPeriodId]);

	return (
		<FormField<Enrollment, SelectProps, number | null>
			key={`${lastReportingPeriodId.value}`}
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
			options={reportingPeriodOptions.map((period) => ({
				value: `${period.id}`,
				text: reportingPeriodFormatter(period, { extended: true }),
			}))}
		/>
	);
};
