import React, { useContext, useState } from 'react';
import { Section } from '../enrollmentTypes';
import Button from '../../../components/Button/Button';
import TextInput from '../../../components/TextInput/TextInput';
import DatePicker from '../../../components/DatePicker/DatePicker';
import Checklist from '../../../components/Checklist/Checklist';
import RadioGroup from '../../../components/RadioGroup/RadioGroup';
import Dropdown from '../../../components/Dropdown/Dropdown';
import nameFormatter from '../../../utils/nameFormatter';
import dateFormatter from '../../../utils/dateFormatter';
import moment from 'moment';
import {
  Child,
  ApiOrganizationsOrgIdSitesSiteIdEnrollmentsPostRequest,
  Gender,
  ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest,
} from '../../../generated';
import idx from 'idx';
import UserContext from '../../../contexts/User/UserContext';
import getIdForUser from '../../../utils/getIdForUser';
import processValidationError from '../../../utils/processValidationError';

const genderFromString = (str: string) => {
  switch (str) {
    case Gender.Female:
      return Gender.Female;
    case Gender.Male:
      return Gender.Male;
    case Gender.Unknown:
      return Gender.Unknown;
    default:
      return Gender.Unspecified;
  }
};

const prettyGender = (child: Child) => {
  switch (child.gender) {
    case Gender.Female:
      return 'Female';
    case Gender.Male:
      return 'Male';
    case Gender.Unknown:
      return 'Unknown';
    default:
      return '';
  }
};

const RACES = [
  'americanIndianOrAlaskaNative',
  'asian',
  'blackOrAfricanAmerican',
  'nativeHawaiianOrPacificIslander',
  'white',
];

const prettyRace = (race: string) => {
  switch (race) {
    case 'americanIndianOrAlaskaNative':
      return 'American Indian or Alaska Native';
    case 'asian':
      return 'Asian';
    case 'blackOrAfricanAmerican':
      return 'Black or African American';
    case 'nativeHawaiianOrPacificIslander':
      return 'Native Hawaiian Or Pacific Islander';
    case 'white':
      return 'White';
  }
};

const prettyMultiRace = (child: Child) => {
  const selectedRaces = RACES.filter(race => (child as any)[race]);

  if (selectedRaces.length === 0) {
    return '';
  } else if (selectedRaces.length === 1) {
    return prettyRace(selectedRaces[0]);
  } else {
    return 'Multiple races';
  }
};

const prettyEthnicity = (child: Child) => {
  return child.hispanicOrLatinxEthnicity ? 'Hispanic/Latinx' : 'Not Hispanic/Latinx';
};

const birthCertPresent = (child: Child) => {
  return child.birthCertificateId && child.birthState && child.birthTown ? 'Yes' : 'No';
};

const ChildInfo: Section = {
  key: 'child-information',
  name: 'Child information',
  status: () => 'complete',
  fields: [
    'firstName',
    'middleName',
    'lastName',
    'sasid'
  ],

  Summary: ({ enrollment }) => {
    var child = enrollment && enrollment.child;
    return (
      <div className="ChildInfoSummary">
        {child && (
          <>
            <p>Name: {nameFormatter(child)}</p>
            <p>Birthdate: {dateFormatter(child.birthdate)}</p>
            <p>Birth certificate: {birthCertPresent(child)}</p>
            <p>Race: {prettyMultiRace(child)}</p>
            <p>Ethnicity: {prettyEthnicity(child)}</p>
            <p>Gender: {prettyGender(child)}</p>
          </>
        )}
      </div>
    );
  },

  Form: ({ enrollment, siteId, mutate, callback }) => {
    if (!enrollment && !siteId) {
      throw new Error('ChildInfo rendered without an enrollment or a siteId');
    }

    const { user } = useContext(UserContext);
    const defaultPostParams: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsPostRequest = {
      orgId: getIdForUser(user, "org"),
      siteId: getIdForUser(user, "site"),
      enrollment: enrollment || undefined
    }
    const defaultPutParams: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest = {
      ...defaultPostParams,
      id: idx(enrollment, _ => _.id) || 0
    }

    const child = enrollment && enrollment.child;
    const [sasid, updateSasid] = useState(child ? child.sasid : null);

    const [firstName, updateFirstName] = useState(child ? child.firstName : null);
    const [middleName, updateMiddleName] = useState(child ? child.middleName : null);
    const [lastName, updateLastName] = useState(child ? child.lastName : null);
    const [suffix, updateSuffix] = useState(child ? child.suffix : null);

    const [birthdate, updateBirthdate] = useState(child ? child.birthdate : null);
    const [birthCertificateId, updateBirthCertificateId] = useState(
      child ? child.birthCertificateId : null
    );
    const [birthTown, updateBirthTown] = useState(child ? child.birthTown : null);
    const [birthState, updateBirthState] = useState(child ? child.birthState : null);

    const [americanIndianOrAlaskaNative, updateAmericanIndianOrAlaskaNative] = useState(
      child ? child.americanIndianOrAlaskaNative : false
    );
    const [asian, updateAsian] = useState(child ? child.asian : false);
    const [blackOrAfricanAmerican, updateBlackOrAfricanAmerican] = useState(
      child ? child.blackOrAfricanAmerican : false
    );
    const [nativeHawaiianOrPacificIslander, updateNativeHawaiianOrPacificIslander] = useState(
      child ? child.nativeHawaiianOrPacificIslander : false
    );
    const [white, updateWhite] = useState(child ? child.white : false);
    const [hispanicOrLatinxEthnicity, updateHispanicOrLatinxEthnicity] = useState(
      child ? child.hispanicOrLatinxEthnicity : false
    );

    const [gender, updateGender] = useState(child ? child.gender : Gender.Unspecified);

    const save = () => {
      const args = {
        sasid,
        firstName,
        middleName,
        lastName,
        suffix,
        birthdate,
        birthCertificateId,
        birthTown,
        birthState,
        americanIndianOrAlaskaNative,
        asian,
        blackOrAfricanAmerican,
        nativeHawaiianOrPacificIslander,
        white,
        hispanicOrLatinxEthnicity,
        gender,
      };

      if (enrollment) {
        const putParams: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest = {
          ...defaultPutParams,
          enrollment: {
            ...enrollment,
            child: {
              ...enrollment.child,
              ...args
            }
          }
        }
        mutate((api) => api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPut(putParams))
          .then((res) => {
            if (callback && res) callback(res);
          })
      } else if (siteId) {
        const postParams: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsPostRequest = {
          ...defaultPostParams,
          enrollment: {
            id: 0,
            siteId: 0,
            child: { ...args }
          }
        }
        mutate((api) => api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsPost(postParams))
          .then((res) => {
            if (callback && res) callback(res);
          })
      } else {
        throw new Error('Something impossible happened');
      }
    };

    return (
      <div className="ChildInfoForm usa-form">
        <div className="grid-row grid-gap">
          <div className="mobile-lg:grid-col-12">
            <TextInput
              id="sasid"
              label="SASID"
              defaultValue={sasid || ''}
              onChange={event => updateSasid(event.target.value)}
              optional={true}
              error={processValidationError("sasid", child ? child.validationErrors : undefined)}
            />
          </div>
          <div className="mobile-lg:grid-col-9">
            <TextInput
              id="firstName"
              label="First"
              defaultValue={firstName || ''}
              onChange={event => updateFirstName(event.target.value)}
            />
          </div>
          <div className="mobile-lg:grid-col-9">
            <TextInput
              id="middleName"
              label="Middle"
              defaultValue={middleName || ''}
              onChange={event => updateMiddleName(event.target.value)}
              optional={true}
            />
          </div>
          <div className="mobile-lg:grid-col-9">
            <TextInput
              id="lastName"
              label="Last"
              defaultValue={lastName || ''}
              onChange={event => updateLastName(event.target.value)}
            />
          </div>
          <div className="mobile-lg:grid-col-3">
            <TextInput
              id="suffix"
              label="Suffix"
              defaultValue={suffix || ''}
              onChange={event => updateSuffix(event.target.value)}
              optional={true}
            />
          </div>
        </div>

        <h3>Date of birth</h3>
        <DatePicker
          onChange={range =>
            updateBirthdate((range.startDate && range.startDate.toDate()) || null)
          }
          dateRange={{ startDate: birthdate ? moment(birthdate) : null, endDate: null }}
        />

        <h3>Birth certificate</h3>
        <div className="grid-row grid-gap">
          <div className="mobile-lg:grid-col-12">
            <TextInput
              id="birthCertificateId"
              label="Birth certificate ID #"
              defaultValue={birthCertificateId || ''}
              onChange={event => updateBirthCertificateId(event.target.value)}
            />
          </div>
          <div className="mobile-lg:grid-col-4">
            <TextInput
              id="birthState"
              label="State"
              defaultValue={birthState || ''}
              onChange={event => updateBirthState(event.target.value)}
            />
          </div>
          <div className="mobile-lg:grid-col-8">
            <TextInput
              id="birthTown"
              label="Town"
              defaultValue={birthTown || ''}
              onChange={event => updateBirthTown(event.target.value)}
            />
          </div>
        </div>

        <h3>Race</h3>
        <p className="oec-form-helper">As identified by family</p>
        <Checklist
          groupName="race"
          legend="Race"
          options={[
            {
              text: 'American Indian or Alaska Native',
              value: 'americanIndianOrAlaskaNative',
              checked: americanIndianOrAlaskaNative || false,
              onChange: event => updateAmericanIndianOrAlaskaNative(event.target.checked),
            },
            {
              text: 'Asian',
              value: 'asian',
              checked: asian || false,
              onChange: event => updateAsian(event.target.checked),
            },
            {
              text: 'Black or African American',
              value: 'blackOrAfricanAmerican',
              checked: blackOrAfricanAmerican || false,
              onChange: event => updateBlackOrAfricanAmerican(event.target.checked),
            },
            {
              text: 'Native Hawaiian or Pacific Islander',
              value: 'nativeHawaiianOrPacificIslander',
              checked: nativeHawaiianOrPacificIslander || false,
              onChange: event => updateNativeHawaiianOrPacificIslander(event.target.checked),
            },
            {
              text: 'White',
              value: 'white',
              checked: white || false,
              onChange: event => updateWhite(event.target.checked),
            },
          ]}
        />

        <h3>Ethnicity</h3>
        <p className="oec-form-helper">As identified by family</p>
        <RadioGroup
          groupName="ethnicity"
          legend="Ethnicity"
          options={[
            {
              text: 'Not Hispanic or Latinx',
              value: 'no',
            },
            {
              text: 'Hispanic or Latinx',
              value: 'yes',
            },
          ]}
          selected={hispanicOrLatinxEthnicity ? 'yes' : 'no'}
          onChange={event => updateHispanicOrLatinxEthnicity(event.target.value === 'yes')}
        />

        <h3>Gender</h3>
        <p className="oec-form-helper">As identified by family</p>
        <Dropdown
          options={[
            {
              value: Gender.Unspecified,
              text: '- Select -',
            },
            {
              value: Gender.Female,
              text: 'Female',
            },
            {
              value: Gender.Male,
              text: 'Male',
            },
            {
              value: Gender.Unknown,
              text: 'Unknown',
            },
          ]}
          label="Gender"
          selected={gender || Gender.Unspecified}
          onChange={event => updateGender(genderFromString(event.target.value))}
        />

        <Button text="Save" onClick={save} />
      </div>
    );
  },
};

export default ChildInfo;
