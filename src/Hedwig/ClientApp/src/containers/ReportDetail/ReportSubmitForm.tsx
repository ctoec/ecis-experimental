import React, { useState, FormEvent, useContext, SetStateAction, Dispatch } from 'react';
import Alert, { AlertProps } from '../../components/Alert/Alert';
import { CdcReport, ApiOrganizationsOrgIdReportsIdPutRequest, CdcReportFromJSON } from '../../generated';
import { Mutate } from '../../hooks/useApi';
import UserContext from '../../contexts/User/UserContext';
import idx from 'idx';
import TextInput from '../../components/TextInput/TextInput';
import Checkbox from '../../components/Checklist/Checkbox';
import { AppContext } from '../App/App';
import currencyFormatter from '../../utils/currencyFormatter';
import parseCurrencyFromString from '../../utils/parseCurrencyFromString';
import getIdForUser from '../../utils/getIdForUser';

export type ReportSubmitFormProps = {
  report: CdcReport,
  mutate: Mutate<CdcReport>,
  setAlert: Dispatch<SetStateAction<AlertProps | null>>,
  canSubmit: boolean
};

export default function ReportSubmitForm({ report, mutate, setAlert, canSubmit }: ReportSubmitFormProps) {
  const [accredited, setAccredited] = useState(report.accredited);
  const [c4KRevenue, setC4KRevenue] = useState(report.c4KRevenue || null);
  const [retroactiveC4KRevenue, setRetroactiveC4KRevenue] = useState(report.retroactiveC4KRevenue);
  const [familyFeesRevenue, setFamilyFeesRevenue] = useState(report.familyFeesRevenue || null);

  const { user } = useContext(UserContext);
  const { invalidateCache: invalidateAppCache } = useContext(AppContext);

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
          setAlert({
            type: 'success',
            heading: 'Report submitted',
            text: 'You have successfully submitted this report'
          });
          invalidateAppCache(); // Updates the count of unsubmitted reports in the nav bar
        }
      })
      .catch(err => {
        console.log(err);
        setAlert({
          type: 'error',
          heading: 'Report not submitted',
          text: 'There was an error submitting this report'
        })
      })
  }

  return (
    <React.Fragment>
      <form className="usa-form" onSubmit={onSubmit}>
        {report.submittedAt && (
          <p>
            <b>Submitted At:</b> {report.submittedAt.toLocaleDateString()}{' '}
          </p>
        )}
        <div className="usa-checkbox">
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
            onBlur={event => (event.target.value = c4KRevenue ? currencyFormatter(c4KRevenue) : '')}
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
            onBlur={event => (event.target.value = familyFeesRevenue ? currencyFormatter(familyFeesRevenue) : '')}
            disabled={!!report.submittedAt}
          />
        </fieldset>
        {!report.submittedAt && <input className="usa-button" type="submit" value="Submit" disabled={!canSubmit} />}
      </form>
    </React.Fragment>
  );
}
