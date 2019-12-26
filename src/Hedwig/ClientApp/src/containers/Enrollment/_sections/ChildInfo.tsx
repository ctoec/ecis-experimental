import React, { useContext, useState, useEffect } from 'react';
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
  ApiOrganizationsOrgIdSitesSiteIdEnrollmentsPostRequest,
  Gender,
  ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest,
  Enrollment,
} from '../../../generated';
import idx from 'idx';
import UserContext from '../../../contexts/User/UserContext';
import getIdForUser from '../../../utils/getIdForUser';
import emptyGuid from '../../../utils/emptyGuid';
import {
  genderFromString,
  prettyGender,
  prettyMultiRace,
  prettyEthnicity,
  birthCertPresent,
  childArgsAreValid,
  getSummaryLine
} from '../../../utils/models';
import {
  sectionHasValidationErrors,
  hasValidationErrors,
  warningForFieldSet,
  warningForField } from '../../../utils/validations';
import FieldSet from '../../../components/FieldSet/FieldSet';



const ChildInfo: Section = {
  key: 'child-information',
  name: 'Child information',
  status: ({ enrollment }) => enrollment && sectionHasValidationErrors([enrollment.child]) ? 'incomplete' : 'complete',

  Summary: ({ enrollment }) => {
    var child = enrollment && enrollment.child;
    return (
      <div className="ChildInfoSummary">
        {child && (
          <>
            <p>Name: {getSummaryLine(nameFormatter(child))}</p>
            <p>Birthdate: {getSummaryLine(dateFormatter(child.birthdate))}</p>
            <p>Birth certificate: {getSummaryLine(birthCertPresent(child))}</p>
            <p>Race: {getSummaryLine(prettyMultiRace(child))}</p>
            <p>Ethnicity: {getSummaryLine(prettyEthnicity(child))}</p>
            <p>Gender: {getSummaryLine(prettyGender(child.gender))}</p>
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
      enrollment: enrollment as Enrollment
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
      child ? child.hispanicOrLatinxEthnicity : null
    );

    const [gender, updateGender] = useState(child ? child.gender : Gender.Unspecified);

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
    const [validArgs, updateValidArgs] = useState();
    const [attemptedSave, updateAttemptedSave] = useState(false);

    useEffect(() => {
      if(childArgsAreValid(args)) {
        updateValidArgs(args);
      } else {
        updateValidArgs(undefined);
      }
    }, [JSON.stringify(args)]);

    const save = () => {
      if(!validArgs) {
<<<<<<< HEAD
        // TODO: apply styling to missing fields
        // TODO: SET ALERT HERE?
=======
        updateAttemptedSave(true);
>>>>>>> master
        return;
      }
      if (enrollment) {
        // If enrollment exists, put to save changes
        const putParams: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest = {
          ...defaultPutParams,
          enrollment: {
            ...enrollment,
            child: {
              id: enrollment.childId,
              organizationId: getIdForUser(user, "org"),
              ...enrollment.child,
              ...validArgs
            }
          }
        }
        mutate((api) => api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPut(putParams))
          .then((res) => {
            if (callback && res) callback(res);
          })
      } else if (siteId) {
        // If enrollment doesn't exist, post to create a new enrollment
        const postParams: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsPostRequest = {
          ...defaultPostParams,
          enrollment: {
            id: 0,
            siteId: getIdForUser(user, "site"),
            childId: emptyGuid(), 
            child: {
              id: emptyGuid(),
              organizationId: getIdForUser(user, "org"),
              ...validArgs
            }
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
            />
          </div>
          <div className="mobile-lg:grid-col-9">
            <TextInput
              id="firstName"
              label="First"
              defaultValue={firstName || ''}
              onChange={event => updateFirstName(event.target.value)}
              error={(attemptedSave && !firstName) 
                ? {type: 'error', message: 'This information is required for enrollment' }
                : undefined
              }
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
              error={(attemptedSave && !lastName)
                ? { type: 'error', message: 'This information is required for enrollment'}
                : undefined
              }
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
        <FieldSet
          error={warningForFieldSet(
            ['birthCertificateId', 'birthState', 'birthTown'],
            enrollment ? enrollment.child : null,
            'This information is required for OEC reporting'
          )}
          legend="Birth certificate"
          display="inline-block"
        >
          <div className="mobile-lg:grid-col-12">
            <TextInput
              id="birthCertificateId"
              label="Birth certificate ID #"
              defaultValue={birthCertificateId || ''}
              onChange={event => updateBirthCertificateId(event.target.value)}
              error={warningForField(
                'birthCertificateId',
                enrollment ? enrollment.child : null,
                ''
              )}
            />
          </div>
          <div className="mobile-lg:grid-col-4 display-inline-block">
            <TextInput
              id="birthState"
              label="State"
              defaultValue={birthState || ''}
              onChange={event => updateBirthState(event.target.value)}
              error={warningForField(
                'birthState',
                enrollment ? enrollment.child : null,
                ''
              )}
            />
          </div>
          <div className="mobile-lg:grid-col-8 display-inline-block">
            <TextInput
              id="birthTown"
              label="Town"
              defaultValue={birthTown || ''}
              onChange={event => updateBirthTown(event.target.value)}
              error={warningForField(
                'birthTown',
                enrollment ? enrollment.child : null,
                ''
              )}
            />
          </div>
        </FieldSet>

        <h3>Race</h3>
        <p className="oec-form-helper">As identified by family</p>
        <Checklist
          error={warningForFieldSet(
            ['americanIndianOrAlaskaNative', 'asian', 'blackOrAfricanAmerican', 'NativeHawaiianOrPacificIslander','white'],
            enrollment ? enrollment.child : null,
            'This information is required for OEC reporting'
          )}
          legend="Race"
          groupName="race"
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
          error={warningForFieldSet(
            ['hispanicOrLatinxEthnicity'],
            enrollment ? enrollment.child : null,
            'This information is required for OEC reporting'
          )}
          legend="Ethnicity"
          groupName="ethnicity"
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
          selected={hispanicOrLatinxEthnicity === null
            ? ''
            : hispanicOrLatinxEthnicity ? 'yes' : 'no'
          }
          onChange={event => updateHispanicOrLatinxEthnicity(
            event.target.value === '' ? null : event.target.value === 'yes'
          )}
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

        <Button text="Save" onClick={save} disabled={attemptedSave && !validArgs}/>
      </div>
    );
  },
};

export default ChildInfo;
