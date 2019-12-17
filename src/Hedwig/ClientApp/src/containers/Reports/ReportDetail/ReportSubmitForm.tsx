import React, { useState, FormEvent, useContext } from 'react';
import { CdcReport, ApiOrganizationsOrgIdReportsIdPutRequest } from '../../../generated';
import { Mutate } from '../../../hooks/useApi';
import UserContext from '../../../contexts/User/UserContext';
import TextInput from '../../../components/TextInput/TextInput';
import Checkbox from '../../../components/Checklist/Checkbox';
import AppContext from '../../../contexts/App/AppContext';
import currencyFormatter from '../../../utils/currencyFormatter';
import parseCurrencyFromString from '../../../utils/parseCurrencyFromString';
import getIdForUser from '../../../utils/getIdForUser';
import UtilizationTable from './UtilizationTable';
import AlertContext, { useAlertContext } from '../../../contexts/Alert/AlertContext';
import { useHistory } from 'react-router';
import { AlertProps } from '../../../components/Alert/Alert';
import monthFormatter from '../../../utils/monthFormatter';
import { DeepNonUndefineable } from '../../../utils/types';

export type ReportSubmitFormProps = {
  report: DeepNonUndefineable<CdcReport>,
  mutate: Mutate<CdcReport>,
  canSubmit: boolean
};

export default function ReportSubmitForm({ report, mutate, canSubmit }: ReportSubmitFormProps) {
  const history = useHistory();
  const [accredited, setAccredited] = useState(report.accredited);
  const [c4KRevenue, setC4KRevenue] = useState(report.c4KRevenue || null);
  const [retroactiveC4KRevenue, setRetroactiveC4KRevenue] = useState(report.retroactiveC4KRevenue);
  const [familyFeesRevenue, setFamilyFeesRevenue] = useState(report.familyFeesRevenue || null);

  const { user } = useContext(UserContext);
  const { invalidateCache: invalidateAppCache } = useContext(AppContext);
  const { alerts, setAlerts } = useContext(AlertContext);
  console.log("submit", alerts);
  const params: ApiOrganizationsOrgIdReportsIdPutRequest = {
    id: report.id || 0,
    orgId: getIdForUser(user, "org")
  };

  function updatedReport(): CdcReport {
    return {
      ...report,
      accredited,
      c4KRevenue: c4KRevenue !== null ? c4KRevenue : undefined,
      retroactiveC4KRevenue,
      familyFeesRevenue: familyFeesRevenue !== null ? familyFeesRevenue : undefined,
    };
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    mutate(
      api => api.apiOrganizationsOrgIdReportsIdPut({
        ...params,
        cdcReport: updatedReport()
      })
    )
      .then(res => {
        if (res) {
          const newAlerts = [{
            type: 'success',
            heading: 'Submitted',
            text: `The ${monthFormatter(report.reportingPeriod.period)} CDC Report has been shared with the Office of Early Childhood`
          }] as AlertProps[];
          setAlerts(newAlerts);
          invalidateAppCache(); // Updates the count of unsubmitted reports in the nav bar
          history.push('/reports', newAlerts);
        }
      })
      .catch(err => {
        console.log(err);
        setAlerts([{
          type: 'error',
          heading: 'Report not submitted',
          text: 'There was an error submitting this report'
        }])
      })
  }

  return (
    <React.Fragment>
    {report.submittedAt && (
      <p>
        <b>Submitted At:</b> {report.submittedAt.toLocaleDateString()}{' '}
      </p>
    )}
    <div className="usa-checkbox margin-bottom-5">
      <input
        className="usa-checkbox__input"
        id="accredited"
        type="checkbox"
        disabled={!!report.submittedAt}
        defaultChecked={accredited}
        onChange={e => setAccredited(e.target.checked)}
      />
      <label className="usa-checkbox__label" htmlFor="accredited">
        Accredited
			</label>
    </div>
    <UtilizationTable {...{...report, accredited}} />
    <form className="usa-form" onSubmit={onSubmit}>
        <fieldset className="usa-fieldset">
          <legend>
            <h2 className="margin-bottom-0 margin-top-2">Other Revenue</h2>
          </legend>
          <TextInput
            id="c4k-revenue"
            label={
              <React.Fragment>
                <span className="text-bold">Care 4 Kids</span>
              </React.Fragment>
            }
            defaultValue={currencyFormatter(c4KRevenue)}
            onChange={(e) => setC4KRevenue(parseCurrencyFromString(e.target.value))}
            onBlur={event => (event.target.value = c4KRevenue !== null ? currencyFormatter(c4KRevenue) : '')}
            disabled={!!report.submittedAt}
          />
          <div className="margin-top-2">
            <Checkbox
              text="Includes retroactive payment for past months"
              value="c4k-includes-retroactive"
              name="c4k-includes-retroactive"
              onChange={(e) => setRetroactiveC4KRevenue(!!e.target.checked)}
              disabled={!!report.submittedAt}
              checked={retroactiveC4KRevenue}
            />
          </div>
          <TextInput
            id="family-fees-revenue"
            label={<span className="text-bold">Family Fees</span>}
            defaultValue={currencyFormatter(familyFeesRevenue)}
            onChange={(e) => setFamilyFeesRevenue(parseCurrencyFromString(e.target.value))}
            onBlur={event => (event.target.value = familyFeesRevenue !== null ? currencyFormatter(familyFeesRevenue) : '')}
            disabled={!!report.submittedAt}
          />
        </fieldset>
        {!report.submittedAt && <input className="usa-button" type="submit" value="Submit" disabled={!canSubmit} />}
      </form>
    </React.Fragment>
  );
}
