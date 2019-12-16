import React from 'react';
import { Section } from '../enrollmentTypes';
import Button from '../../../components/Button/Button';
import TextInput from '../../../components/TextInput/TextInput';
import DatePicker from '../../../components/DatePicker/DatePicker';
import dateFormatter from '../../../utils/dateFormatter';
import notNullOrUndefined from '../../../utils/notNullOrUndefined';
import moment from 'moment';
import idx from 'idx';
import { ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest } from '../../../generated';
import parseCurrencyFromString from '../../../utils/parseCurrencyFromString';
import currencyFormatter from '../../../utils/currencyFormatter';

const FamilyIncome: Section = {
  key: 'family-income',
  name: 'Family income',
  status: () => 'complete',

  Summary: ({ enrollment }) => {
    if (!enrollment || !enrollment.child || !enrollment.child.family) return <></>;
    const determination = idx(enrollment, _ => _.child.family.determinations[0])
    return (
      <div className="FamilyIncomeSummary">
        {determination ? (
          <>
            <p>Household size: {determination.numberOfPeople}</p>
            <p>Annual household income: {currencyFormatter(idx(determination, _ => _.income))}</p>
            <p>Determined on: {dateFormatter(idx(determination, _ => _.determined))}</p>
          </>
        ) : (
            <p>No income determination on record.</p>
          )}
      </div>
    );
  },

  Form: ({ enrollment, mutate, callback }) => {
    if (!enrollment || !enrollment.child || !enrollment.child.family) {
      throw new Error("family info required for family income, but can't render a link to family info here b/c that causes react hook out of order unhappiness");
      // return (
      // 	<div className="FamilyIncomeForm usa-form">
      // 		Must add Family information before family income can be added!
      // 		<Link to='edit/family-info'>Add family information</Link>
      // 	</div>
      // );
    }

    const defaultParams: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest = {
      id: enrollment.id || 0,
      siteId: idx(enrollment, _ => _.siteId) || 0,
      orgId: idx(enrollment, _ => _.site.organizationId) || 0,
      enrollment: enrollment
    }

    const child = enrollment.child;
    const determination = idx(child, _ => _.family.determinations[0]) || undefined;
    const [numberOfPeople, updateNumberOfPeople] = React.useState(
      determination ? determination.numberOfPeople : null
    );
    const [income, updateIncome] = React.useState(determination ? determination.income : null);
    const [determined, updateDetermined] = React.useState(
      determination ? determination.determined : null
    );

    const save = () => {
      // If determination is not added, allow user to proceed without creating one
      if (!numberOfPeople && !income && !determined) {
        if (callback) {
          callback(enrollment);
        }
        return;
      }

      // If determination is added, all fields must be present
      if (numberOfPeople && income && determined) {
        const args = {
          numberOfPeople: numberOfPeople || undefined,
          income: income || undefined,
          determined: determined || undefined,
        };

        if (enrollment && child && child.family) {
          const params: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest = {
            ...defaultParams,
            enrollment: {
              ...enrollment,
              child: {
                ...child,
                family: {
                  ...child.family,
                  determinations: determination ? [{
                    ...determination,
                    ...args
                  }] : [{ 
                    id: 0,
                    familyId: child.family.id,
                    ...args 
                  }]
                }
              }
            }
          };
          mutate((api) => api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPut(params))
            .then((res) => {
              if (callback && res) callback(res);
            });
        }
      }
    };

    return (
      <div className="FamilyIncomeForm usa-form">
        <TextInput
          id="numberOfPeople"
          label="Household size"
          defaultValue={numberOfPeople ? '' + numberOfPeople : ''}
          onChange={event => {
            const value = parseInt(event.target.value.replace(/[^0-9.]/g, ''), 10) || null;
            updateNumberOfPeople(value);
          }}
          onBlur={event => (event.target.value = numberOfPeople ? '' + numberOfPeople : '')}
          small
        />
        <TextInput
          id="income"
          label="Annual household income"
          defaultValue={currencyFormatter(income)}
          onChange={event => {
            updateIncome(parseCurrencyFromString(event.target.value));
          }}
          onBlur={event => (event.target.value = notNullOrUndefined(income) ? currencyFormatter(income) : '')}
        />
        <label className="usa-label" htmlFor="date">
          Date determined
				</label>
        <DatePicker
          onChange={range =>
            updateDetermined((range.startDate && range.startDate.toDate()) || null)
          }
          dateRange={{ startDate: determined ? moment(determined) : null, endDate: null }}
        />
        <Button text="Save" onClick={save} />
      </div>
    );
  },
};

export default FamilyIncome;
