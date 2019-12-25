import React, { useState, useContext, useEffect } from 'react';
import { Section } from '../enrollmentTypes';
import Button from '../../../components/Button/Button';
import TextInput from '../../../components/TextInput/TextInput';
import DatePicker from '../../../components/DatePicker/DatePicker';
import dateFormatter from '../../../utils/dateFormatter';
import notNullOrUndefined from '../../../utils/notNullOrUndefined';
import moment from 'moment';
import idx from 'idx';
import { ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest, Enrollment, FamilyDetermination } from '../../../generated';
import Checklist from '../../../components/Checklist/Checklist';
import Alert from '../../../components/Alert/Alert';
import parseCurrencyFromString from '../../../utils/parseCurrencyFromString';
import currencyFormatter from '../../../utils/currencyFormatter';
import getIdForUser from '../../../utils/getIdForUser';
import UserContext from '../../../contexts/User/UserContext';
import { sectionHasValidationErrors, errorForField, warningForFieldSet, errorForFieldSet } from '../../../utils/validations';
import { determinationArgsAreValid } from '../../../utils/models';
import FieldSet from '../../../components/FieldSet/FieldSet';

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
						<p>Income not disclosed.</p>
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
    const [determinationDate, updateDeterminationDate] = React.useState(
      determination ? determination.determinationDate : null
    );
	  const [notDisclosed, updateNotDisclosed] = useState(
      determination ? determination.notDisclosed : false
		);
		
		const args = {
			numberOfPeople,
			income,
			determinationDate,
			notDisclosed
		};
		const [validArgs, updateValidArgs] = useState();
		const [attemptedSave, updateAttemptedSave] = useState(false);

		useEffect(() => {
			if(determinationArgsAreValid(args)) {
				updateValidArgs(args);
			} else {
				updateValidArgs(undefined);
			}
		}, [JSON.stringify(args)])

		function proceedWithoutCreatingDetermination(args: any) {
		  return !args.notDisclosed && !args.numberOfPeople && !args.income && !args.determinationDate;
		}

    const save = () => {
      if (proceedWithoutCreatingDetermination(args)) {
        if (callback) {
          callback(enrollment);
        }
        return;
			}
			
			if(!validArgs) {
				updateAttemptedSave(true);
				return;
			}

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
                  ...validArgs
                }] : [{ 
                  id: 0,
                  familyId: child.family.id,
                  ...validArgs 
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
    };

    return (
   	  <div className="FamilyIncomeForm">
		  	<div className="usa-form">
		  		{!notDisclosed && (
		  			<>
						<FieldSet
							id="family-income"
							legend="Family income determination"
							error={errorForFieldSet(
								[numberOfPeople, income, determinationDate],
								attemptedSave,
								!notDisclosed,
								'If income is disclosed, this information is required for enrollment'
							)}
							>
			  				<TextInput
			  					id="numberOfPeople"
			  					label="Household size"
			  					defaultValue={numberOfPeople ? '' + numberOfPeople : ''}
			  					onChange={event => {
			  						const value = parseInt(event.target.value.replace(/[^0-9.]/g, ''), 10) || null;
			  						updateNumberOfPeople(value);
			  					}}
									onBlur={event => (event.target.value = numberOfPeople ? '' + numberOfPeople : '')}
									error={errorForField(
										numberOfPeople,
										attemptedSave,
										!notDisclosed,
									)}
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
									error={errorForField(
										income, 
										attemptedSave,
										!notDisclosed
									)}
			  				/>
			  				<label className="usa-label" htmlFor="date">
									{/* TODO: THE NON UNIQUE HTML FOR ID MAKES THIS LABEL MEANINGLESS TO SCREEN READERS */}
			  					Date of income determination
			  				</label>
			  				<DatePicker
									legend="Income determination date"
									id="income-determination-date"
			  					onChange={range =>
			  						updateDeterminationDate((range.startDate && range.startDate.toDate()) || null)
			  					}
			  					dateRange={{ startDate: determinationDate ? moment(determinationDate) : null, endDate: null }}
			  				/>
							</FieldSet>
		  			</>
		  		)}
			  	<Checklist
						legend="Family income disclosure"
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
		  		<Button text="Save" onClick={save} disabled={attemptedSave && !validArgs}/>
		  	</div>
		  </div>
	  );
  },
};

export default FamilyIncome;
