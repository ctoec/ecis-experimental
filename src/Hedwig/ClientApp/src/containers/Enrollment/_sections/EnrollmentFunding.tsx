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

	Summary: ({ child }) => {
		const currentEnrollment = child && child.enrollments.find(enrollment => !enrollment.exit);

		return (
			<div className="EnrollmentFundingSummary">
				{currentEnrollment && (
					<>
						<p>Site: {currentEnrollment.site.name}</p>
						<p>
							Enrolled:{' '}
							{dateFormatter(currentEnrollment.entry) +
								'–' +
								(currentEnrollment.exit ? dateFormatter(currentEnrollment.exit) : '')}
						</p>
						<p>Age: {prettyAge(currentEnrollment.age)}</p>
					</>
				)}
			</div>
		);
	},

	Form: ({ child, afterSave }) => {
		const currentEnrollment = child && child.enrollments.find(enrollment => !enrollment.exit);

		if (!currentEnrollment) {
			throw new Error('EnrollmentFunding rendered without an enrollment');
		}

		const [updateEnrollment] = useAuthMutation<UpdateEnrollmentMutation>(
			UPDATE_ENROLLMENT_MUTATION,
			{
				onCompleted: () => {
					if (child && afterSave) {
						afterSave(child);
					}
				},
			}
		);

		const [siteId, updateSiteId] = React.useState(
			currentEnrollment ? currentEnrollment.site.id : null
		);
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
			<div className="EnrollmentFundingForm usa-form">
				<Dropdown
					options={[
						{
							value: '' + currentEnrollment.site.id,
							text: currentEnrollment.site.name,
						},
					]}
					label="Site"
					selected={siteId ? '' + siteId : undefined}
					onChange={event => updateSiteId(parseInt(event.target.value, 10))}
				/>
				<label className="usa-label" htmlFor="date">
					Start date
				</label>
				<DatePicker
					onChange={range =>
						updateEntry((range.startDate && range.startDate.format('YYYY-MM-DD')) || null)
					}
					dateRange={{ startDate: entry ? moment(entry) : null, endDate: null }}
				/>

				<h3>Age</h3>
				<RadioGroup
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
				/>

				<h3>Funding</h3>

				<Button text="Save" onClick={save} />
			</div>
		);
	},
};

export default EnrollmentFunding;
