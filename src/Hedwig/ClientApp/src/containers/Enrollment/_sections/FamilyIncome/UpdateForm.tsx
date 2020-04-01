import React, { useState, useEffect, useContext } from 'react';
import { SectionProps } from '../../enrollmentTypes';
import {
	initialLoadErrorGuard,
	warningForFieldSet,
	isBlockingValidationError,
} from '../../../../utils/validations';
import { DeepNonUndefineable } from '../../../../utils/types';
import { Enrollment, FamilyDetermination } from '../../../../generated';
import idx from 'idx';
import { inverseDeterminationSorter } from '../../../../utils/models';
import { FieldSet, Button, Card } from '../../../../components';
import currencyFormatter from '../../../../utils/currencyFormatter';
import Form from '../../../../components/Form/Form';
import FormInset from '../../../../components/Form/FormInset';
import {
	householdSizeField,
	annualHouseholdIncomeField,
	determinationDateField,
	incomeDisclosedField,
} from './Form';
import FormSubmitButton from '../../../../components/Form/FormSubmitButton';
import dateFormatter from '../../../../utils/dateFormatter';
import { ExpandCard } from '../../../../components/Card/ExpandCard';
import { CardExpansion } from '../../../../components/Card/CardExpansion';
import AlertContext from '../../../../contexts/Alert/AlertContext';
import { validationErrorAlert } from '../../../../utils/stringFormatters/alertTextMakers';

const UpdateForm: React.FC<SectionProps> = ({
	enrollment,
	updateEnrollment,
	error,
	success,
	loading,
}) => {
	if (!enrollment || !enrollment.child || !enrollment.child.family) {
		throw new Error('FamilyIncome rendered without enrollment.child.family');
	}

	// set up form state
	const initialLoad = false;
	const { setAlerts } = useContext(AlertContext);
	const [addNewDetermination, setAddNewDetermination] = useState(false);
	const [isNew, setIsNew] = useState(false);
	const [attemptingSave, setAttemptingSave] = useState(false);
	const [forceClose, setForceClose] = useState<boolean>(false);
	useEffect(() => {
		if (loading) {
			return;
		}
		if (error) {
			if (!isBlockingValidationError(error)) {
				throw new Error(error.title || 'Unknown api error');
			}
			setAlerts([validationErrorAlert]);
			return;
		}
		if (success) {
			setAttemptingSave(false);
			if (addNewDetermination) {
				setIsNew(true);
			}
			setAddNewDetermination(false);
			setForceClose(true);
		}
	}, [loading, error, success]);

	const child = enrollment.child;
	const determinations: DeepNonUndefineable<FamilyDetermination[]> =
		idx(child, _ => _.family.determinations as DeepNonUndefineable<FamilyDetermination[]>) || [];
	const sortedDeterminations = [...determinations].sort(inverseDeterminationSorter);
	const currentDetermination = sortedDeterminations[0];
	const pastDeterminations = sortedDeterminations.slice(1);
	const determinationIdToIndexMap = determinations.reduce<{ [x: number]: number }>(
		(acc, determination, index) => ({
			...acc,
			[determination.id]: index,
		}),
		{}
	);

	const formInset = (sortedIndex: number, index: number) => (
		<FormInset<Enrollment, { initialLoad: boolean }>
			render={({ containingData: enrollment, additionalInformation }) => {
				const originalDetermination = sortedDeterminations[sortedIndex];
				const determination =
					idx(enrollment, _ => _.child.family.determinations[index]) || undefined;
				const determinationDate = determination && determination.determinationDate;
				const notDisclosed = determination && determination.notDisclosed;
				const { initialLoad } = additionalInformation;
				if (notDisclosed) {
					return incomeDisclosedField(index);
				}
				return (
					<FieldSet
						id="family-income"
						legend="Family income"
						status={initialLoadErrorGuard(
							initialLoad,
							// Missing information for dedeterminationIndextermination warning
							warningForFieldSet(
								'family-income',
								// Only check for determinationDate errors if it does not have a value. Otherwise, the error is about the
								// value of determinationDate and should not trigger a missing information alert
								['numberOfPeople', 'income', !determinationDate ? 'determinationDate' : ''],
								determination ? determination : null,
								'This information is required for OEC reporting'
							) ||
								// Missing determination warning
								warningForFieldSet(
									'family-income',
									['determinations'],
									idx(enrollment, _ => _.child.family) || null,
									'Income must be determined or marked as not disclosed',
									true
								)
						)}
					>
						<div>{householdSizeField(index)}</div>
						<div>{annualHouseholdIncomeField(index)}</div>
						<div>{determinationDateField(index)}</div>
						{originalDetermination.notDisclosed && <div>{incomeDisclosedField(index)}</div>}
					</FieldSet>
				);
			}}
		/>
	);

	const cardDetails = (determination: FamilyDetermination) => {
		return (
			<div className="usa-grid">
				<div className="grid-row">
					<div className="grid-col">
						{!determination.notDisclosed ? (
							<>
								<div className="grid-row text-bold">
									<div className="grid-col">Household size</div>
									<div className="grid-col">Income</div>
									<div className="grid-col">Determination on</div>
								</div>
								<div className="grid-row">
									<div className="grid-col">
										<div className="margin-top-2">{determination.numberOfPeople}</div>
									</div>
									<div className="grid-col">
										<div className="margin-top-2">{currencyFormatter(determination.income)}</div>
									</div>
									<div className="grid-col">
										<div className="margin-top-2">
											{dateFormatter(determination.determinationDate)}
										</div>
									</div>
								</div>
							</>
						) : (
							<p>Income not disclosed</p>
						)}
					</div>
					<div className="grid-col-1 flex-align-self--center">
						<ExpandCard>
							<Button text="Edit" appearance="unstyled" />
						</ExpandCard>
					</div>
				</div>
			</div>
		);
	};

	const form = (sortedIndex: number, index: number, submitText: string, isEdit: boolean) => (
		<Form<Enrollment>
			noValidate
			autoComplete="off"
			className="FamilyIncomeForm"
			data={enrollment}
			onSave={enrollment => {
				updateEnrollment(enrollment as DeepNonUndefineable<Enrollment>);
				setAttemptingSave(true);
			}}
			additionalInformation={{
				initialLoad,
			}}
		>
			<p className="text-bold font-sans-lg margin-top-2">
				{isEdit ? 'Edit family income determination' : 'Redetermine family income'}
			</p>
			{formInset(sortedIndex, index)}
			<div className="display-flex">
				<div className="usa-form">
					{isEdit ? (
						<ExpandCard>
							<Button text="Cancel" appearance="outline" />
						</ExpandCard>
					) : (
						<Button
							text="Cancel"
							appearance="outline"
							onClick={() => setAddNewDetermination(false)}
						/>
					)}
					<FormSubmitButton
						text={attemptingSave ? 'Saving...' : submitText}
						disabled={attemptingSave}
					/>
				</div>
			</div>
		</Form>
	);

	return (
		<>
			<h2 className="margin-bottom-1">Family income determination</h2>
			{addNewDetermination && (
				<Card stretched={false}>
					{form(determinations.length, determinations.length, 'Redetermine', false)}
				</Card>
			)}
			<div className="display-flex align-center">
				<h3>Current income determination</h3>
				&nbsp;&nbsp;&nbsp;
				<Button
					text={'Add new income determination'}
					appearance="unstyled"
					onClick={() => setAddNewDetermination(true)}
				/>
			</div>
			<div>
				{currentDetermination ? (
					<Card
						showTag={isNew}
						onExpansionChange={expanded => !expanded && setForceClose(false)}
						forceClose={forceClose}
						key={currentDetermination.id}
					>
						{cardDetails(currentDetermination)}
						<CardExpansion>
							{form(0, determinationIdToIndexMap[currentDetermination.id], 'Save', true)}
						</CardExpansion>
					</Card>
				) : (
					<p>No determinations</p>
				)}
			</div>
			{pastDeterminations.length > 0 && (
				<>
					<h3>Past income determinations</h3>
					<div>
						{pastDeterminations.map((determination, index) => (
							<Card
								appearance="secondary"
								className="margin-bottom-2"
								onExpansionChange={expanded => !expanded && setForceClose(false)}
								forceClose={forceClose}
								key={determination.id}
							>
								{cardDetails(determination)}
								<CardExpansion>
									{form(index + 1, determinationIdToIndexMap[determination.id], 'Save', true)}
								</CardExpansion>
							</Card>
						))}
					</div>
				</>
			)}
		</>
	);
};

export default UpdateForm;
