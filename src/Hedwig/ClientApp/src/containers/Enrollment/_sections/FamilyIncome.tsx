import React from 'react';
import useAuthMutation from '../../../hooks/useAuthMutation';
import {
	CREATE_FAMILY_DETERMINATION_MUTATION,
	UPDATE_FAMILY_DETERMINATION_MUTATION,
	CHILD_QUERY,
} from '../enrollmentQueries';
import { CreateFamilyDeterminationMutation } from '../../../generated/CreateFamilyDeterminationMutation';
import { UpdateFamilyDeterminationMutation } from '../../../generated/UpdateFamilyDeterminationMutation';
import { ChildQuery } from '../../../generated/ChildQuery';
import { Section } from '../enrollmentTypes';
import Button from '../../../components/Button/Button';
import TextInput from '../../../components/TextInput/TextInput';
import DatePicker from '../../../components/DatePicker/DatePicker';
import dateFormatter from '../../../utils/dateFormatter';
import moment from 'moment';
import idx from 'idx';

const FamilyIncome: Section = {
	key: 'family-income',
	name: 'Family income',
	status: () => 'complete',

	Summary: ({ enrollment }) => {
		if (!enrollment) return <></>;
		const determination = idx(enrollment, _ => _.child.family.determinations[0])
		return (
			<div className="FamilyIncomeSummary">
				{determination ? (
					<>
						<p>Household size: {determination.numberOfPeople}</p>
						<p>Annual household income: ${idx(determination, _ => _.income.toFixed(2))}</p>
						{/* <p>Determined on: {dateFormatter(idx(determination, _ => _.determined))}</p> */}
					</>
				) : (
					<p>No income determination on record.</p>
				)}
			</div>
		);
	},

	Form: ({ enrollment, afterSave }) => {
		if(!enrollment || ! enrollment.child || !enrollment.child.family) {
			throw new Error('FamilyIncome rendered without a family');
		}

		var child = enrollment.child;
		const [createFamilyDetermination] = useAuthMutation<CreateFamilyDeterminationMutation>(
			CREATE_FAMILY_DETERMINATION_MUTATION,
			{
				update: (cache, { data }) => {
					const cachedData = cache.readQuery<ChildQuery>({
						query: CHILD_QUERY,
						variables: { id: child.id },
					});

					if (cachedData && cachedData.child && cachedData.child.family) {
						cachedData.child.family.determinations.push(data.createFamilyWithChild);

						cache.writeQuery({
							query: CHILD_QUERY,
							data: cachedData,
							variables: { id: child.id },
						});
					}
				},
				onCompleted: () => {
					if (afterSave) {
						afterSave(enrollment);
					}
				},
			}
		);

		const [updateFamilyDetermination] = useAuthMutation<UpdateFamilyDeterminationMutation>(
			UPDATE_FAMILY_DETERMINATION_MUTATION,
			{
				onCompleted: () => {
					if (afterSave) {
						afterSave(enrollment);
					}
				},
			}
		);

		const familyId = idx(child, _ => _.family.id);
		const determination = idx(child, _ => _.family.determinations[0]);

		const [numberOfPeople, updateNumberOfPeople] = React.useState(
			determination ? determination.numberOfPeople : null
		);
		const [income, updateIncome] = React.useState(determination ? determination.income : null);
		const [determined, updateDetermined] = React.useState(
			determination ? determination.determined : null
		);

		const save = () => {
			if (numberOfPeople || income || determined) {
				const args = {
					numberOfPeople,
					income,
					determined,
				};

				if (determination) {
					updateFamilyDetermination({ variables: { ...args, id: determination.id } });
				} else {
					createFamilyDetermination({ variables: { ...args, familyId } });
				}
			} else {
				if (afterSave) {
					afterSave(enrollment);
				}
			}
		};

		return (
			<div className="FamilyIncomeForm usa-form">
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
					defaultValue={income ? '$' + income.toFixed(2) : ''}
					onChange={event => {
						const value =
							Math.round(parseFloat(event.target.value.replace(/[^0-9.]/g, '')) * 100) / 100 ||
							null;
						updateIncome(value);
					}}
					onBlur={event => (event.target.value = income ? '$' + income.toFixed(2) : '')}
				/>
				<label className="usa-label" htmlFor="date">
					Date determined
				</label>
				{/* <DatePicker
					onChange={range =>
						updateDetermined((range.startDate && range.startDate.format('YYYY-MM-DD')) || null)
					}
					dateRange={{ startDate: determined ? moment(determined) : null, endDate: null }}
				/> */}
				<Button text="Save" onClick={save} />
			</div>
		);
	},
};

export default FamilyIncome;
