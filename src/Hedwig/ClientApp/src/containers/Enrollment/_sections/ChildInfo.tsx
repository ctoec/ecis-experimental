import React from 'react';
import { Section } from '../enrollmentTypes';
import Button from '../../../components/Button/Button';
import nameFormatter from '../../../utils/nameFormatter';

const ChildInfo: Section = {
	key: 'child-information',
	name: 'Child information',
	status: () => 'complete',

	Summary: ({ child }) => {
		return (
			<div className="ChildInfoSummary">
				<p>{nameFormatter(child)}</p>
			</div>
		);
	},

	Form: ({ child, siteId, afterSave }) => {
		if (!child && !siteId) {
			throw new Error('ChildInfo rendered without a child or a siteId');
		}

		const [firstName, updateFirstName] = React.useState(child ? child.firstName : '');
		const [middleName, updateMiddleName] = React.useState(child ? child.middleName : '');
		const [lastName, updateLastName] = React.useState(child ? child.lastName : '');

		const save = () => {
			// Mutate the data here.
			if (afterSave) {
				afterSave();
			}
		};

		return (
			<div className="ChildInfoForm">
				<input
					type="text"
					name="firstName"
					placeholder="First"
					onChange={event => updateFirstName(event.target.value)}
					value={firstName}
				/>
				<br />
				<br />
				<input
					type="text"
					name="middleName"
					placeholder="Middle"
					onChange={event => updateMiddleName(event.target.value)}
					value={middleName || ''}
				/>
				<br />
				<br />
				<input
					type="text"
					name="lastName"
					placeholder="Last"
					onChange={event => updateLastName(event.target.value)}
					value={lastName}
				/>
				<br />
				<br />

				<Button text="Save" onClick={save} />
			</div>
		);
	},
};

export default ChildInfo;
