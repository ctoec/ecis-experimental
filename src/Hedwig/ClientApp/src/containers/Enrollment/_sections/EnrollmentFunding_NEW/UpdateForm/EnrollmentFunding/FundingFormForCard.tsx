import React from 'react';
import { Enrollment, FundingSpace } from '../../../../../../generated';
import { Form, FormSubmitButton } from '../../../../../../components/Form_New';
import { FundingField } from '../../Fields/Funding';
import { Button } from '../../../../../../components';
import { ExpandCard } from '../../../../../../components/Card/ExpandCard';
import { ApiError } from '../../../../../../hooks/useApi';
import { ErrorAlertState } from '../../../../../../hooks/useCatchAllErrorAlert';

type FundingFormForCardProps = {
	fundingId: number;
	formData: Enrollment;
	onSubmit: (_: Enrollment) => void;
	fundingSpaces: FundingSpace[];
	error: ApiError | null,
	errorAlertState: ErrorAlertState;
};

/**
 * TODO: when we add functionality to create new funding, extend this form to distinguish
 * - Button not wrapped in ExpandCard. Instead: takes in & invokes onCancel prop, which
 * 	 should set some 'showAddNewFunding' state var from calling context to false
 */
export const FundingFormForCard: React.FC<FundingFormForCardProps> = ({
	fundingId,
	formData,
	onSubmit,
	fundingSpaces,
	error,
	errorAlertState
}) => {
	return (
		<Form id={`edit-funding-${fundingId}`} data={formData} onSubmit={onSubmit} className="usa-form">
			<FundingField 
				fundingId={fundingId}
				fundingSpaces={fundingSpaces}
				error={error}
				errorAlertState={errorAlertState}
			/>
			<ExpandCard>
				<Button text="Cancel" appearance="outline" />
			</ExpandCard>
			<FormSubmitButton text="Save edits" />
		</Form>
	);
};
