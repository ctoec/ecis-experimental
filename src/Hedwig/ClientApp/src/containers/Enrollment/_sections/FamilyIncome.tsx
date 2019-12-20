import React, { useState, useContext } from 'react';
import { Section } from '../enrollmentTypes';
import Button from '../../../components/Button/Button';
import TextInput from '../../../components/TextInput/TextInput';
import DatePicker from '../../../components/DatePicker/DatePicker';
import dateFormatter from '../../../utils/dateFormatter';
import notNullOrUndefined from '../../../utils/notNullOrUndefined';
import moment from 'moment';
import idx from 'idx';
import { ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest, Enrollment } from '../../../generated';
import Checklist from '../../../components/Checklist/Checklist';
import Checkbox from '../../../components/Checklist/Checkbox';
import Alert from '../../../components/Alert/Alert';
import parseCurrencyFromString from '../../../utils/parseCurrencyFromString';
import currencyFormatter from '../../../utils/currencyFormatter';
import getIdForUser from '../../../utils/getIdForUser';
import UserContext from '../../../contexts/User/UserContext';
import { sectionHasValidationErrors } from '../../../utils/validations';

const FamilyIncome: Section = {
  key: 'family-income',
  name: 'Family income determination',
  status: ({ enrollment }) =>  sectionHasValidationErrors([idx(enrollment, _ => _.child.family.determinations) || null]) ? 'incomplete': 'complete',

	Summary: ({ enrollment }) => {
		if (!enrollment || !enrollment.child || !enrollment.child.family) return <></>;
		const determination = idx(enrollment, _ => _.child.family.determinations[0])
		return (
			<div className="FamilyIncomeSummary">
				{determination ?
					determination.notDisclosed ? (
						<p>Income determination not disclosed.</p>
					) : (
						<>
							<p>Household size: {determination.numberOfPeople}</p>
							<p>Annual household income: ${idx(determination, _ => _.income.toFixed(2))}</p>
							<p>Determined on: {dateFormatter(idx(determination, _ => _.determinationDate))}</p>
						</>
					) : (
						<p>No income determination on record.</p>
					)
				}
			</div>
		);
	},

	Form: ({ enrollment, mutate, callback }) => {
		if(!enrollment || ! enrollment.child || !enrollment.child.family) {
			throw new Error("FamilyIncome rendered without enrollment.child.family");
		}

		const { user } = useContext(UserContext);
    const defaultParams: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest = {
      id: enrollment.id || 0,
      siteId: getIdForUser(user, "site"),
      orgId: getIdForUser(user, "org"),
      enrollment: enrollment
    }

    const child = enrollment.child;
    const determination = idx(child, _ => _.family.determinations[0]) || undefined;
    const [numberOfPeople, updateNumberOfPeople] = React.useState(
      determination ? determination.numberOfPeople : null
    );
    const [income, updateIncome] = React.useState(determination ? determination.income : null);
    const [determined, updateDetermined] = React.useState(
      determination ? determination.determinationDate : null
    );
	  const [notDisclosed, updateNotDisclosed] = useState(
      determination ? determination.notDisclosed : false
    );

    const save = () => {
      // If determination is not added, allow user to proceed without creating one
      if (!numberOfPeople && !income && !determined && !notDisclosed) {
        if (callback) {
          callback(enrollment);
        }
        return;
      }

      // If determination is added, all fields must be present
      // or notDisclosed must be true
      if ((numberOfPeople && income && determined) || notDisclosed) {
        const args = {
          notDisclosed: notDisclosed,
          numberOfPeople: notDisclosed ? undefined: (numberOfPeople || undefined),
          income: notDisclosed ? undefined : (income || undefined),
          determined: notDisclosed ? undefined : (determined || undefined),
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
   	  <div className="FamilyIncomeForm">
		  	<div className="usa-form">
		  		{!notDisclosed && (
		  			<>
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
		  				Date of income determination
		  			</label>
		  			<DatePicker
		  				onChange={range =>
		  					updateDetermined((range.startDate && range.startDate.toDate()) || null)
		  				}
		  				dateRange={{ startDate: determined ? moment(determined) : null, endDate: null }}
		  			/>
		  			</>
		  		)}
					<br/>
		  		<Checklist
						groupName="familyIncome"
						options={[
							{
								text: 'Family income not disclosed',
								value: 'familyIncomeNotDisclosed',
								checked: notDisclosed,
								onChange: event => updateNotDisclosed(event.target.checked)
							}
						]}
		  		/>
		  	</div>

		  	{notDisclosed &&
		  		<Alert
		  			type="info"
		  			text="Income information is required to enroll a child in a CDC funded space. You will not be able to assign this child to a funding space without this information."
		  		/>
		  	}

		  	<div className="usa-form">
		  		<Button text="Save" onClick={save} />
		  	</div>
		  </div>
	  );
  },
};

export default FamilyIncome;
