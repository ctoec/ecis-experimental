import React, { useState } from 'react';
import { Enrollment } from '../../../../../generated';
import {
	WithNewDetermination,
	IncomeDeterminationFieldSet,
} from '../Fields';
import { Button } from '../../../../../components';
import FormSubmitButton from '../../../../../components/Form_New/FormSubmitButton';
import Form from '../../../../../components/Form_New/Form';
import { ExpandCard } from '../../../../../components/Card/ExpandCard';

/**
 * The single-determination form to be embedded in Cards in the UpdateForm.
 *
 * The component relies on determinationId to determine which flavor of CardForm it is:
 * - determinationId = 0: displayed in a Card as the primary content to create a new determination
 * - determinationId != 0: displayed in a CardExpansion as the expanded context to edit existing determination with given id
 */
const FamilyDeterminationFormForCard = ({
	determinationId,
	formData,
	onSubmit,
	onCancel,
}: {
	determinationId: number;
	formData: Enrollment;
	onSubmit: (_: Enrollment) => void;
	onCancel?: () => void;
}) => {
	// determinationId !== 0 means edit, not redetermination
	const isEditExpansion = determinationId !== 0;

	// Use a basic button to cancel adding new determination,
	// or an ExpandCard button to cancel editing an existing determination
	const cancelElement = !isEditExpansion ? (
		<Button
			text="Cancel"
			appearance="outline"
			onClick={() => {
				if (onCancel) onCancel();
			}}
		/>
	) : (
		<ExpandCard>
			<Button text="Cancel" appearance="outline" />
		</ExpandCard>
	);

	return (
		<Form
			id={`update-family-income-${determinationId}`}
			data={formData}
			onSubmit={onSubmit}
			className="update-family-income-form"
		>
				<WithNewDetermination shouldCreate={!isEditExpansion}>
					<IncomeDeterminationFieldSet
						type={isEditExpansion ? 'edit' : 'redetermine'}
						determinationId={determinationId}
					/>
				</WithNewDetermination>
			<div className="display-flex">
				<div className="usa-form">
					{cancelElement}
					<FormSubmitButton text={isEditExpansion ? 'Save' : 'Redetermine'} />
				</div>
			</div>
		</Form>
	);
};

export default FamilyDeterminationFormForCard;
