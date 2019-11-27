import React from 'react';
import { Section } from '../enrollmentTypes';
import Button from '../../../components/Button/Button';
import DatePicker from '../../../components/DatePicker/DatePicker';
import Dropdown from '../../../components/Dropdown/Dropdown';
import RadioGroup from '../../../components/RadioGroup/RadioGroup';
import dateFormatter from '../../../utils/dateFormatter';
import moment from 'moment';
import idx from 'idx';
import { ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest, Age } from '../../../OAS-generated';

const ageFromString = (str: string) => {
	switch (str) {
		case Age.Infant:
			return Age.Infant;
		case Age.Preschool:
			return Age.Preschool;
		case Age.School:
			return Age.School;
		default:
			return null;
	}
};

const prettyAge = (age: Age | null) => {
	switch (age) {
		case Age.Infant:
			return 'Infant/Toddler';
		case Age.Preschool:
			return 'Preschool';
		case Age.School:
			return 'School-age';
		default:
			return '';
	}
};

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
						{/* <p>
							Enrolled:{' '}
							{dateFormatter(idx(currentEnrollment, _ => _.entry)) +
								'–' +
								dateFormatter(idx(currentEnrollment, _ => _.exit))}
						</p> */}
						{/* <p>Age: {prettyAge(idx(currentEnrollment, _ => _.age) || null)}</p> */}
					</>
				)}
			</div>
		);
	},

	Form: ({ enrollment, mutate }) => {

		if (!enrollment) {
			throw new Error('EnrollmentFunding rendered without an enrollment');
		}

		const defaultParams: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPutRequest = {
			id: enrollment.id || 0,
			siteId: idx(enrollment, _ => _.siteId) || 0,
			orgId: idx(enrollment, _ => _.site.organizationId) || 0,
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
				mutate((api) => api.apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPut(params), (_, result) => result);
			}
		};

		return (
			<div className="EnrollmentFundingForm">
				<div className="usa-form">
					<Dropdown
						options={[
							{
								value: '' + idx(enrollment, _ => _.siteId),
								text: '' + idx(enrollment, _ => _.site.name),
							},
						]}
						label="Site"
						selected={siteId ? '' + siteId : undefined}
						onChange={event => updateSiteId(parseInt(event.target.value, 10))}
					/>
					<label className="usa-label" htmlFor="date">
						Start date
					</label>
					{/* <DatePicker
						onChange={range =>
							updateEntry((range.startDate && range.startDate.format('YYYY-MM-DD')) || null)
						}
						dateRange={{ startDate: entry ? moment(entry) : null, endDate: null }}
					/> */}

					<h3>Age</h3>
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
