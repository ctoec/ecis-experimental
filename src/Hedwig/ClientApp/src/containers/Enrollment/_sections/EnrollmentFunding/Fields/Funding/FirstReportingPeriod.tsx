import React, { useState, useEffect, useContext } from 'react';
import { Enrollment, ReportingPeriod } from '../../../../../../generated';
import ReportingPeriodContext from '../../../../../../contexts/ReportingPeriod/ReportingPeriodContext';
import FormContext, { useGenericContext } from '../../../../../../components/Form_New/FormContext';
import moment from 'moment';
import FormField from '../../../../../../components/Form_New/FormField';
import { SelectProps, Select } from '../../../../../../components';
import { reportingPeriodFormatter, getIdForUser } from '../../../../../../utils/models';
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
	useEffect(() => {
		if (!reportingPeriods) return;

		// valid reporting periods:
		// - end on or after the enrollment start date
		// - are after the most recent reporting period for which there is a submitted report
		const minPeriodEndDate = mostRecentlySubmittedReport
			? moment.max(
					moment.utc(mostRecentlySubmittedReport.reportingPeriod.periodEnd),
					moment.utc(startDate)
			  )
			: moment.utc(startDate);

		const startIdx = reportingPeriods.findIndex((period) =>
			moment.utc(period.periodEnd).isSameOrAfter(minPeriodEndDate)
		);

		// Show the user 5 reporting period options, starting from the minimum end date
		const _validReportingPeriods = reportingPeriods.slice(startIdx, startIdx + 4);
		setValidReportingPeriods(_validReportingPeriods);
	}, [startDate]);

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
				text: reportingPeriodFormatter(period),
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
