import React from 'react';
import useAuthMutation from '../../../hooks/useAuthMutation';
import { UPDATE_ENROLLMENT_MUTATION } from '../enrollmentQueries';
import { UpdateEnrollmentMutation } from '../../../generated/UpdateEnrollmentMutation';
import { Age } from '../../../generated/globalTypes';
import { Section } from '../enrollmentTypes';
import Button from '../../../components/Button/Button';
import DatePicker from '../../../components/DatePicker/DatePicker';
import Dropdown from '../../../components/Dropdown/Dropdown';
import RadioGroup from '../../../components/RadioGroup/RadioGroup';
import dateFormatter from '../../../utils/dateFormatter';
import moment from 'moment';
import idx from 'idx';

const ageFromString = (str: string) => {
	switch (str) {
		case Age.INFANT:
			return Age.INFANT;
		case Age.PRESCHOOL:
			return Age.PRESCHOOL;
		case Age.SCHOOL:
			return Age.SCHOOL;
		default:
			return null;
	}
};

const prettyAge = (age: Age | null) => {
	switch (age) {
		case Age.INFANT:
			return 'Infant/Toddler';
		case Age.PRESCHOOL:
			return 'Preschool';
		case Age.SCHOOL:
			return 'School-age';
		default:
			return '';
	}
};

const EnrollmentFunding: Section = {
	key: 'enrollment-funding',
	name: 'Enrollment and funding',
	status: () => 'complete',

	Summary: ({ enrollment : currentEnrollment}) => {
		if(!currentEnrollment) return <></>;
		return (
			<div className="EnrollmentFundingSummary">
				{currentEnrollment && (
					<>
						<p>Site: {idx(currentEnrollment, _ => _.site.name)} </p>
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

	Form: ({ enrollment: currentEnrollment, mutate }) => {

		if (!currentEnrollment) {
			throw new Error('EnrollmentFunding rendered without an enrollment');
		}

		const [updateEnrollment] = useAuthMutation<UpdateEnrollmentMutation>(
			UPDATE_ENROLLMENT_MUTATION,
			{
				onCompleted: () => {
					if (currentEnrollment) {
						// afterSave(currentEnrollment);
					}
				},
			}
		);

		const [siteId, updateSiteId] = React.useState(idx(currentEnrollment, _ => _.siteId));

		const [entry, updateEntry] = React.useState(currentEnrollment ? currentEnrollment.entry : null);
		const [age, updateAge] = React.useState(currentEnrollment ? currentEnrollment.age : null);

		const save = () => {
			const args = {
				entry,
				age,
			};

			updateEnrollment({ variables: { ...args, id: currentEnrollment.id } });
		};

		return (
			<div className="EnrollmentFundingForm">
				<div className="usa-form">
					<Dropdown
						options={[
							{
								value: '' + idx(currentEnrollment, _ => _.siteId),
								text: '' + idx(currentEnrollment, _ => _.site.name),
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
					{/* <RadioGroup
						groupName="age"
						legend="Age"
						options={[
							{
								text: 'Infant/Toddler',
								value: Age.INFANT,
							},
							{
								text: 'Preschool',
								value: Age.PRESCHOOL,
							},
							{
								text: 'School-age',
								value: Age.SCHOOL,
							},
						]}
						selected={'' + age}
						onChange={event => updateAge(ageFromString(event.target.value))}
					/> */}
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
