import { Enrollment } from '../../../../../generated';
import { displayValidationStatus } from '../../../../../utils/validations/displayValidationStatus';
import {
	INFORMATION_REQUIRED_IF_INCOME_DISCLOSED,
	REQUIRED_FOR_OEC_REPORTING,
} from '../../../../../utils/validations/messageStrings';
import React from 'react';
import { HouseholdSizeField, AnnualHouseholdIncomeField, DeterminationDateField } from '.';
import { errorDisplayGuard } from '../../../../../utils/validations';
import { FormFieldSet } from '@ctoec/component-library';
// TODO
import { FormStatusFunc } from '@ctoec/component-library/dist/components/Form/FormStatusFunc';

type IncomeDeterminationFieldSetProps = {
	type: 'new' | 'redetermine' | 'edit';
	determinationId: number;
	blockErrorDisplay?: boolean;
};

export const IncomeDeterminationFieldSet: React.FC<IncomeDeterminationFieldSetProps> = ({
	type,
	determinationId,
	blockErrorDisplay = false,
}) => {
	let status, elementId, legend, showLegend;
	switch (type) {
		case 'redetermine':
			status = undefined;
			elementId = 'family-income-redetermination';
			legend = 'Redetermine family income';
			showLegend = true;
			break;

		case 'edit':
			status = ((data) =>
				errorDisplayGuard(
					blockErrorDisplay,
					displayValidationStatus([
						{
							type: 'warning',
							response:
								data
									.at('child')
									.at('family')
									.at('determinations')
									.find((det) => det.id === determinationId)
									.at('validationErrors').value || null,
							fields: ['numberOfPeople', 'income', 'determinationDate'],
							message: REQUIRED_FOR_OEC_REPORTING,
						},
					])
				)) as FormStatusFunc<Enrollment>;
			elementId = `family-income-determination-edit-${determinationId}`;
			legend = 'Edit family income';
			showLegend = true;
			break;

		case 'new':
			status = ((data) =>
				displayValidationStatus([
					{
						type: 'warning',
						response:
							data
								.at('child')
								.at('family')
								.at('determinations')
								.find((det) => det.id === determinationId)
								.at('validationErrors').value || null,
						fields: ['numberOfPeople', 'income', 'determinationDate'],
						message: INFORMATION_REQUIRED_IF_INCOME_DISCLOSED,
					},
				])) as FormStatusFunc<Enrollment>;
			elementId = 'family-income-determination';
			legend = 'Family income determination';
			showLegend = false;
			break;
	}

	return (
		<FormFieldSet<Enrollment>
			status={status}
			id={elementId}
			legend={legend}
			showLegend={showLegend}
			legendStyle="title"
		>
			<div>
				<HouseholdSizeField
					determinationId={determinationId}
					blockErrorDisplay={blockErrorDisplay}
				/>
			</div>
			<div>
				<AnnualHouseholdIncomeField
					determinationId={determinationId}
					blockErrorDisplay={blockErrorDisplay}
				/>
			</div>
			<div>
				<DeterminationDateField
					determinationId={determinationId}
					blockErrorDisplay={blockErrorDisplay}
				/>
			</div>
		</FormFieldSet>
	);
};
