import React from "react";
import { Enrollment, FundingSpace } from "../../../../../../../generated"
import { Form, FormSubmitButton } from "../../../../../../../components/Form_New"
import { FundingField } from "../../../Fields/Funding";
import { Button } from "../../../../../../../components";

type FundingFormForCardProps=  {
	fundingId: number;
	formData: Enrollment;
	onSubmit: (_: Enrollment) => void;
	onCancel?: () => void;
	fundingSpaces: FundingSpace[];
}

export const FundingFormForCard: React.FC<FundingFormForCardProps> = ({
	fundingId,
	formData,
	onSubmit,
	onCancel,
	fundingSpaces,
}) => {
	return (
		<Form
			id={`edit-funding-${fundingId}`}
			data={formData}
			onSubmit={onSubmit}
			className="usa-form"
		>
			<FundingField initialLoad={false} fundingId={fundingId} fundingSpaces={fundingSpaces}/>
			<div>
				<Button
					text="Cancel"
					appearance="outline"
					onClick={() => {
						if(onCancel) onCancel()
					}}
				/>
				<FormSubmitButton text="Save edits" />
			</div>
		</Form>
	)
}
