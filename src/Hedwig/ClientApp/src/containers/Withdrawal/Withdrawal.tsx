import React, { useContext, useState, useEffect } from "react";
import { History } from 'history';
import UserContext from "../../contexts/User/UserContext";
import { Enrollment, Funding, FundingSource, ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGetRequest, ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest, ValidationProblemDetails, ValidationProblemDetailsFromJSON, ReportingPeriod } from "../../generated";
import nameFormatter from "../../utils/nameFormatter";
import { DeepNonUndefineable } from "../../utils/types";
import { generateFundingTag, enrollmentExitReasons, currentFunding } from "../../utils/models";
import DatePicker from "../../components/DatePicker/DatePicker";
import Dropdown from "../../components/Dropdown/Dropdown";
import useApi from "../../hooks/useApi";
import { lastNReportingPeriods } from "../../utils/models/reportingPeriod";
import getIdForUser from "../../utils/getIdForUser";
import Button from "../../components/Button/Button";
import CommonContainer from "../CommonContainer";
import { clientErrorForField, serverErrorForField } from "../../utils/validations";
import ReportingPeriodContext from "../../contexts/ReportingPeriod/ReportingPeriodContext";
import { processBlockingValidationErrors } from "../../utils/validations/processBlockingValidationErrors";
import InlineIcon from "../../components/InlineIcon/InlineIcon";
import AlertContext from "../../contexts/Alert/AlertContext";
import { splitCamelCase } from "../../utils/splitCamelCase";

type WithdrawalProps = {
  history: History,
  match: {
    params: {
      enrollmentId?: number;
    }
  }
};

export default function Withdrawal({
  history,
  match: {
    params: { enrollmentId }
  }
}: WithdrawalProps) {
  const { user } = useContext(UserContext);
  const { setAlerts } = useContext(AlertContext);
  const { cdcReportingPeriods: reportingPeriods } = useContext(ReportingPeriodContext);

  const defaultParams: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGetRequest = {
    id: enrollmentId || 0,
    orgId: getIdForUser(user, 'org'),
    siteId: getIdForUser(user, 'site'),
  }

  const [loading, error, enrollment, mutate] = useApi<Enrollment>(
    api => api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGet({
      ...defaultParams,
      include: ['child', 'family', 'determinations', 'fundings', 'sites']
    }),
    [enrollmentId, user],
    {
      skip: !enrollmentId
    }
  );

  const [enrollmentEndDate, updateEnrollmentEndDate] = useState<Date>();
  const [exitReason, updateExitReason] = useState<string>();
  const [lastReportingPeriod, updateLastReportingPeriod] = useState<ReportingPeriod>();

  const [reportingPeriodOptions, updateReportingPeriodOptions] = useState(reportingPeriods);

  const [attemptedSave, setAttemptedSave] = useState(false);
  const [apiError, setApiError] = useState<ValidationProblemDetails>();

  const fundings = (enrollment && enrollment.fundings) ? enrollment.fundings : [] as DeepNonUndefineable<Funding[]>;
  const cdcFundings = fundings.filter(funding => funding.source === FundingSource.CDC);
  const cdcFunding = currentFunding(cdcFundings);

  useEffect(() => {
    updateReportingPeriodOptions(
      lastNReportingPeriods(
        reportingPeriods,
        enrollmentEndDate || new Date(Date.now()),
        5
      )
    )
  }, [reportingPeriods, enrollmentEndDate]);

  // TODO: replace this whole endeavor with ability to simply select a first reporting period in this form
  const cannotWithdraw = cdcFunding && !cdcFunding.firstReportingPeriod;
  useEffect(() => {
    if(cannotWithdraw) {
      setAlerts([{
        type: 'error',
        heading: 'Information needed to withdraw child',
        text: 'To withdraw a child from a funded space in your program, "first reporting period" cannot be blank. Please update this information for the child before withdrawing'
      }]);
      history.push(`/roster/enrollments/${enrollment.id}`);
    }
  }, [enrollment]);

  if(loading || error || !enrollment) {
    return <div className="Withdrawl"></div>;
  }

  const save = () => {
    setAttemptedSave(true);

    //enrollment end date (exit) is required for withdrawl
    if(!enrollmentEndDate) {
      return;
    }

    let updatedFundings: Funding[] = fundings;
    if(cdcFunding && lastReportingPeriod) {
      updatedFundings = [
        ...(fundings.filter<DeepNonUndefineable<Funding>>(funding => funding.id !== cdcFunding.id)),
        {
          ...cdcFunding,
          lastReportingPeriodId: lastReportingPeriod.id,
          lastReportingPeriod: lastReportingPeriod
        }
      ]
    }

    const c4KFunding =  currentFunding(fundings.filter<DeepNonUndefineable<Funding>>(funding => funding.source === FundingSource.C4K));
    if(c4KFunding) {
      updatedFundings = [
        ...(updatedFundings.filter(funding => funding.id != c4KFunding.id)),
        {
          ...c4KFunding,
          certificateEndDate: enrollmentEndDate
        }
      ]
    }

    const putParams: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest = {
      ...defaultParams,
      enrollment: {
        ...enrollment,
        exit: enrollmentEndDate,
        exitReason,
        fundings: updatedFundings
      }
    }

    mutate(api => api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPut(putParams))
      .then(() => {
        setAlerts([{
          type: 'success',
          heading: 'Withdrawn',
          text: `${nameFormatter(enrollment.child)} has been successfully withdrawn from the program. Their information can be found by searching for "past enrollments".`
        }]);
        history.push(`/roster`)
      })
      .catch(async (error) => {
        setApiError(await ValidationProblemDetailsFromJSON(error));
      });
  }

  return (
    <CommonContainer
      directionalLinkProps={
        {direction: 'left', to: `/roster/enrollments/${enrollment.id}/`, text:'Back'}
      }
    >
        <section className="grid-container">
          <h1>Withdraw from program</h1>
          <div>
            <h2>{nameFormatter(enrollment.child)}</h2>
            <div className="grid-row grid-gap margin-top-neg-1">
              <div className="mobile-lg:grid-col-6">
                <h4>Current enrollment</h4>
                <p className="margin-top-neg-2 line-height-sans-4">
                	{enrollment.site.name}<br />
                	Age: {splitCamelCase(enrollment.ageGroup, '/')}<br />
                	Enrollment date: {enrollment.entry && enrollment.entry.toLocaleDateString()}
                </p>
              </div>
              {cdcFunding &&
                <div className="mobile-lg:grid-col-6">
                  <h4>Funding</h4>
                  <p className="margin-top-neg-2 line-height-sans-4">
	                  {generateFundingTag(cdcFunding)}<br />
	                  Enrollment: {cdcFunding.time}<br />
	                  First reporting period: {cdcFunding.firstReportingPeriod
                    	? cdcFunding.firstReportingPeriod.period.toLocaleDateString()
                    	: InlineIcon({icon: 'attentionNeeded'})
                  }
                  </p>
                </div>
              }
            </div>

            <div className="usa-form">
              <div className="grid-row grid-gap">
                <div className="mobile-lg:grid-col-12">
                  <DatePicker
                    label="Enrollment end date"
                    id="enrollment-end-date"
                    onChange={range =>
                      updateEnrollmentEndDate((range.startDate && range.startDate.toDate()) || undefined)
                    }
                    dateRange={{ startDate: null, endDate: null}}
                    status={
                      reportingPeriodOptions.length === 0
                      ? { type: 'error', id: 'last-reporting-period-error', message: 'ECE Reporter only contains data for fiscal year 2020 and later. Please do not add children who withdrew prior to July 2019.' }
                      : apiError && processBlockingValidationErrors("exit", apiError.errors)
                        ? serverErrorForField(
                          "exit",
                          apiError)
                        : clientErrorForField(
                          "exit",
                          enrollmentEndDate,
                          attemptedSave,
                          "This information is required for withdrawal"
                        )
                     }
                  />
                  <Dropdown
                    label="Reason"
                    id="exit-reason"
                    options={Object.entries(enrollmentExitReasons).map(
                      ([key, reason]) => ({value: key, text: reason})
                    )}
                    otherText="Other"
                    noSelectionText="-Select-"
                    onChange={event => updateExitReason(event.target.value)}
                    status={serverErrorForField(
                      "exitreason",
                      apiError,
                      "This information is required for withdrawal"
                    )}
                  />
                  {cdcFunding && <Dropdown
                    label="Last reporting period"
                    id="last-reporting-period"
                    options={reportingPeriodOptions.map(period => 
                      ({ 
                        value: '' + period.id,
                        text: `${period.periodStart.toLocaleDateString()} - ${period.periodEnd.toLocaleDateString()}`
                      })
                    )}
                    noSelectionText="-Select-"
                    onChange={event => {
                      const chosen = reportingPeriods.find<ReportingPeriod>( period => period.id === parseInt(event.target.value))
                      updateLastReportingPeriod(chosen);
                    }}
                    status={serverErrorForField(
                      "fundings",
                      apiError,
                      lastReportingPeriod ? undefined : 'This information is required for withdrawal'
                    )}
                  />}
                </div>
              </div>
            </div>

            <div className="grid-row margin-y-6">
              <div className="mobile-lg:grid-col-auto">
                <Button text="Cancel" href={`/roster/enrollments/${enrollment.id}/`} appearance='outline' />
              </div>
              <div className="mobile-lg:grid-col-auto padding-left-2">
                <Button text="Confirm and withdraw" onClick={save} disabled={cannotWithdraw}/>
              </div>
            </div>
          </div>
        </section>
    </CommonContainer>
  )
}
