import React from 'react';
import { Enrollment } from '../../../../../../generated';
import { ApiError } from '../../../../../../hooks/useApi';
import { Form, FormSubmitButton } from '../../../../../../components/Form_New';
import { LastReportingPeriodField } from '../../Fields/Funding/LastReportingPeriod';
import { Button } from '../../../../../../components';

type EndFundingFormForCardProps = {
	fundingId: number;
	formData: Enrollment;
	onSubmit: (_: Enrollment) => void;
	onCancel: () => void;
	error: ApiError | null;
};

/**
 * A form to be embedded in a Card in the UpdateForm,
 * used to end the current funding.
 */
export const EndFundingFormForCard: React.FC<EndFundingFormForCardProps> = ({
	fundingId,
	formData,
	onSubmit,
	onCancel,
	error,
}) => {
	return (
		<Form<Enrollment>
			id="end-current-funding"
			className="usa-form"
			data={formData}
			onSubmit={onSubmit}
		>
			<h3>End current funding</h3>
			<LastReportingPeriodField fundingId={fundingId} error={error} />
			<Button text="Cancel" onClick={onCancel} />
			<FormSubmitButton text="End funding" />
		</Form>
	);
};
