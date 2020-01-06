import React, { useContext, useState, useEffect } from "react";
import { History } from 'history';
import UserContext from "../../contexts/User/UserContext";
import { Enrollment, Funding, FundingSource, ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGetRequest, ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest, ValidationProblemDetails, ValidationProblemDetailsFromJSON } from "../../generated";
import nameFormatter from "../../utils/nameFormatter";
import { DeepNonUndefineable, tsFilter } from "../../utils/types";
import { generateFundingTag, enrollmentExitReasons, currentFunding } from "../../utils/models";
import DatePicker from "../../components/DatePicker/DatePicker";
import Dropdown from "../../components/Dropdown/Dropdown";
import useApi from "../../hooks/useApi";
import { nextNReportingPeriods } from "../../utils/models/reportingPeriod";
import getIdForUser from "../../utils/getIdForUser";
import Button from "../../components/Button/Button";
import CommonContainer from "../CommonContainer";
import { errorForField, errorForFieldNEW } from "../../utils/validations";
import ReportingPeriodContext from "../../contexts/ReportingPeriod/ReportingPeriodContext";

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
  const { cdcReportingPeriods: reportingPeriods } = useContext(ReportingPeriodContext);

  const defaultParams: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGetRequest = {
    id: enrollmentId || 0,
    orgId: getIdForUser(user, 'org'),
    siteId: getIdForUser(user, 'site'),
  }

  const [loading, error, enrollment, mutate] = useApi<Enrollment>(
    api => api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGet({
      ...defaultParams,
      include: ['child', 'family', 'determinations', 'fundings', 'sites', 'reporting_periods']
    }),
    [enrollmentId, user],
    {
      skip: !enrollmentId
    }
  );

  const [enrollmentEndDate, updateEnrollmentEndDate] = useState<Date>();
  const [exitReason, updateExitReason] = useState<string>();
  const [lastReportingPeriodId, updateLastReportingPeriodId] = useState<number>();
  const args = {
    enrollmentEndDate,
    exitReason,
    lastReportingPeriodId
  };

  const [apiError, setApiError] = useState<ValidationProblemDetails>();

  if(loading || error || !enrollment) {
    return <div className="Withdrawl"></div>;
  }

  const fundings = enrollment.fundings ? enrollment.fundings : [] as DeepNonUndefineable<Funding[]>;
  const cdcFundings = fundings.filter(funding => funding.source === FundingSource.CDC);
  const cdcFunding = currentFunding(cdcFundings);

  const save = () => {
    let updatedFundings: Funding[] = fundings;
    if(cdcFunding) {
      updatedFundings = [
        ...(fundings.filter<DeepNonUndefineable<Funding>>(funding => funding.id !== cdcFunding.id)),
        {
          ...cdcFunding,
          lastReportingPeriodId: lastReportingPeriodId
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
        history.push(`/roster`)
      })
      .catch(async (error) => {
        setApiError(ValidationProblemDetailsFromJSON(error));
      });
  }

  return (
    <CommonContainer
      directionalLinkProps={
        {direction: 'left', to: `/roster/enrollments/${enrollment.id}`, text:'Back'}
      }
    >
        <section className="grid-container">
          <h1>Withdraw from program</h1>
          <div className="margin-left-5">
            <h2>{nameFormatter(enrollment.child)}</h2>
            <div className="grid-row grid-gap">
              <div className="mobile-lg:grid-col-6">
                <h4>Current enrollment</h4>
                <p>{enrollment.site.name}</p>
                <p>Age: {enrollment.ageGroup}</p>
                <p>Enrollment date: {enrollment.entry && enrollment.entry.toLocaleDateString()}</p>              </div>
              {cdcFunding && 
                <div className="mobile-lg:grid-col-6">
                  <h4>Funding</h4>
                  {generateFundingTag(cdcFunding)}
                  <p>Enrollment: {cdcFunding.time}</p>
                  <p>First reporting period: {cdcFunding.firstReportingPeriod.period.toLocaleDateString()}</p>
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
                    status={errorForFieldNEW(
                      "exit",
                      apiError
                    )}
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
                    status={errorForFieldNEW(
                      "exitreason",
                      apiError,
                      "This field is required for withdrawal"
                    )}
                  />
                  <Dropdown
                    label="Last reporting period"
                    id="last-reporting-period"
                    options={
                      nextNReportingPeriods(
                        reportingPeriods,
                        enrollmentEndDate || new Date(Date.now()),
                        5
                      ).map(period => 
                        ({ 
                          value: '' + period.id,
                          text: `${period.periodStart.toLocaleDateString()} - ${period.periodEnd.toLocaleDateString()}`
                        })
                      )
                    }
                    noSelectionText="-Select-"
                    onChange={event => {
                      updateLastReportingPeriodId(parseInt(event.target.value))
                    }}
                    status={errorForFieldNEW(
                      "funding",
                      apiError
                    )}
                  />
                </div>
              </div>
              <div className="grid-row">
                <div className="mobile-lg:grid-col-auto">
                  <Button text="Cancel" href={`/roster/enrollments/${enrollment.id}/`} appearance='base' />
                </div>
                <div className="mobile-lg:grid-col-auto">
                  <Button text="Confirm and withdraw" onClick={save} />
                </div>
              </div>
            </div>
          </div>
        </section>
    </CommonContainer>
  )
}