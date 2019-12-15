import React, { useContext } from 'react';
import { Section } from '../enrollmentTypes';
import Button from '../../../components/Button/Button';
import DatePicker from '../../../components/DatePicker/DatePicker';
import Dropdown from '../../../components/Dropdown/Dropdown';
import RadioGroup from '../../../components/RadioGroup/RadioGroup';
import dateFormatter from '../../../utils/dateFormatter';
import moment from 'moment';
import idx from 'idx';
import { ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest, Age } from '../../../generated';
import UserContext from '../../../contexts/User/UserContext';
import { ageFromString, prettyAge } from '../../../utils/ageGroupUtils';
import getIdForUser from '../../../utils/getIdForUser';

const EnrollmentFunding: Section = {
  key: 'enrollment-funding',
  name: 'Enrollment and funding',
  status: () => 'complete',

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
            <p>Age: {prettyAge(idx(enrollment, _ => _.age) || null)}</p>
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
    const [age, updateAge] = React.useState(enrollment ? enrollment.age : null);

    const save = () => {
      const args = {
        entry: entry || undefined,
        age: age || undefined
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
            options={idx(user, _ => _.orgPermissions[0].organization.sites.map(s => ({
              value: '' + s.id,
              text: '' + s.name
            })))
              || []}
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
								value: Age.Infant,
							},
							{
								text: 'Preschool',
								value: Age.Preschool,
							},
							{
								text: 'School-age',
								value: Age.School,
							},
						]}
						selected={'' + age}
						onChange={event => updateAge(ageFromString(event.target.value))}
					/>
				</div>

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

        <div className="usa-form">
          <Button text="Save" onClick={save} />
        </div>
      </div>
    );
  },
};

export default EnrollmentFunding;
