import React, { useContext } from 'react';
import { Section } from '../enrollmentTypes';
import Button from '../../../components/Button/Button';
import DatePicker from '../../../components/DatePicker/DatePicker';
import Dropdown from '../../../components/Dropdown/Dropdown';
import RadioGroup from '../../../components/RadioGroup/RadioGroup';
import dateFormatter from '../../../utils/dateFormatter';
import moment from 'moment';
import idx from 'idx';
import { ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest, Age, Enrollment } from '../../../generated';
import UserContext from '../../../contexts/User/UserContext';
import { ageFromString, prettyAge } from '../../../utils/ageGroupUtils';
import getIdForUser from '../../../utils/getIdForUser';
import { DeepNonUndefineable } from '../../../utils/types';
import Alert from '../../../components/Alert/Alert';

const EnrollmentFunding: Section = {
  key: 'enrollment-funding',
  name: 'Enrollment and funding',
  status: () => 'complete',
  ValidationObjects: (enrollment: DeepNonUndefineable<Enrollment>) => [enrollment, enrollment.fundings],

  Summary: ({ enrollment }) => {
    if (!enrollment) return <></>;
    return (
      <div className="EnrollmentFundingSummary">
        {enrollment && (
          <>
            <p>Site: {idx(enrollment, _ => _.site.name)} </p>
            <p>
              Enrolled:{' '}
              {dateFormatter(idx(enrollment, _ => _.entry)) +
                '–' +
                dateFormatter(idx(enrollment, _ => _.exit))}
            </p>
            <p>Age: {prettyAge(idx(enrollment, _ => _.ageGroup) || null)}</p>
          </>
        )}
      </div>
    );
  },

  Form: ({ enrollment, mutate, callback }) => {
    if (!enrollment) {
      throw new Error('EnrollmentFunding rendered without an enrollment');
    }

    const { user } = useContext(UserContext);
    const defaultParams: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest = {
      id: enrollment.id || 0,
      orgId: getIdForUser(user, "org"),
      siteId: getIdForUser(user, "site"),
      enrollment: enrollment
    }

    const [siteId, updateSiteId] = React.useState(idx(enrollment, _ => _.siteId));

    const [entry, updateEntry] = React.useState(enrollment ? enrollment.entry : null);
    const [age, updateAge] = React.useState(enrollment ? enrollment.ageGroup : null);

    const familyDeterminationNotDisclosed = (enrollment: Enrollment) : boolean => {
      let determinations = idx(enrollment, _ => _.child.family.determinations)
  
      // If no determinations are present, not disclosed = false
      // (because it is not explicitly true)
      if (!determinations || determinations.length == 0) return false;
      determinations = determinations.sort((a, b) => {
        if (a.determinationDate > b.determinationDate) return 1;
        if (a.determinationDate < b.determinationDate) return -1;
        return 0;
      });

      return determinations[0].notDisclosed;
    };
    
    const save = () => {
      const args = {
        entry: entry,
        age: age
      };

      if (enrollment) {
        const params: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest = {
          ...defaultParams,
          enrollment: {
            ...enrollment,
            ...args
          }
        }
        mutate((api) => api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPut(params))
          .then((res) => {
            if (callback && res) callback(res);
          });
      }
    };

    return (
      <div className="EnrollmentFundingForm">
        <div className="usa-form">
          <Dropdown
            options={
              idx(user, _ => _.orgPermissions[0].organization.sites.map(s => ({
                value: `${s.id}`,
                text: s.name
              })))
              || []
            }
            label="Site"
            selected={siteId ? '' + siteId : undefined}
            onChange={event => updateSiteId(parseInt(event.target.value, 10))}
          />
          <label className="usa-label" htmlFor="date">
            Start date
					</label>
					<DatePicker
						onChange={range =>
							updateEntry((range.startDate && range.startDate.toDate()) || null)
						}
						dateRange={{ startDate: entry ? moment(entry) : null, endDate: null }}
					/>

					<h3>Age group</h3>
					<RadioGroup
						groupName="age"
						legend="Age"
						options={[
							{
								text: 'Infant/Toddler',
                value: Age.InfantToddler,
							},
							{
								text: 'Preschool',
								value: Age.Preschool,
							},
							{
								text: 'School-age',
								value: Age.SchoolAge,
							},
						]}
						selected={'' + age}
						onChange={event => updateAge(ageFromString(event.target.value))}
					/>
          {!familyDeterminationNotDisclosed(enrollment) &&
            <>
            <h3>Funding</h3>
 				    <ul className="oec-action-list">
 				  	  <li>
 				  		  <Button appearance="unstyled" text="Assign to a Child Day Care space" />
 				  		  &nbsp; (1 available starting December 2019)
 				  	  </li>
              <li>
                <Button appearance="unstyled" text="Add Care 4 Kids subsidy" />
              </li>
            </ul>
            </>
          } 
				</div>

        {familyDeterminationNotDisclosed(enrollment) &&
          <Alert 
            type="info"
            text="Funding options not available because family income was not provided. To change, edit the previous section."
          />
        }
        
        <div className="usa-form">
          <Button text="Save" onClick={save} />
        </div>
      </div>
    );
  },
};

export default EnrollmentFunding;
