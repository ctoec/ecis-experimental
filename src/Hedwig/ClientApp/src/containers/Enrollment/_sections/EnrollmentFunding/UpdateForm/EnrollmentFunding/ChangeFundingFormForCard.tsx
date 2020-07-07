import React from 'react';
import { Enrollment, FundingSpace, Funding } from '../../../../../../generated';
import { ApiError } from '../../../../../../hooks/useApi';
import { Form, FormSubmitButton } from '../../../../../../components/Form_New';
import { LastReportingPeriodField } from '../../Fields/Funding/LastReportingPeriod';
import { Button } from '../../../../../../components';
import { FundingField } from '../../Fields/Funding';
import { prettyFundingSpaceTime } from '../../../../../../utils/models';

type ChangeFundingFormForCardProps = {
	currentFunding?: Funding;
	formData: Enrollment;
	fundingSpaces: FundingSpace[];
	onSubmit: (_: Enrollment) => void;
	onCancel: () => void;
	error: ApiError | null;
};

/**
 * A form to be embedded in a Card in the UpdateForm,
 * used to create a new funding, and end a previously current funding
 * if one exists
 */
export const ChangeFundingFormForCard: React.FC<ChangeFundingFormForCardProps> = ({
	currentFunding,
	formData,
	fundingSpaces,
	onSubmit,
	onCancel,
	error,
}) => {
	return (
		<Form<Enrollment>
			id="create-new-funding"
			className="usa-form"
			data={formData}
			onSubmit={onSubmit}
		>
			<h3>Change funding</h3>
			<FundingField fundingId={0} fundingSpaces={fundingSpaces} error={error} />
			{currentFunding && (
				<LastReportingPeriodField
					label={`Last reporting period for current ${currentFunding.source + ' '}${
						prettyFundingSpaceTime(currentFunding.fundingSpace) + ' '
					}funding`}
					fundingId={currentFunding.id}
					error={error}
				/>
			)}
			<Button text="Cancel" onClick={onCancel} />
			<FormSubmitButton text="Change funding" />
		</Form>
	);
};
