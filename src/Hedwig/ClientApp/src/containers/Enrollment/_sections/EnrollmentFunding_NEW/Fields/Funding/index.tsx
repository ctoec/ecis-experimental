import React, { useEffect, useState } from 'react';
import FormContext, { useGenericContext } from '../../../../../../components/Form_New/FormContext';
import { Enrollment, FundingSource, FundingSpace } from '../../../../../../generated';
import { FundingFormFieldProps } from '../../Fields/common';
import { prettyFundingSource, fundingSourceFromString } from '../../../../../../utils/models';
import RadioButton from '../../../../../../components/RadioButton/RadioButton';
import { ContractSpaceField } from './ContractSpace';
import { FirstReportingPeriodField } from './FirstReportingPeriod';
import produce from 'immer';
import set from 'lodash/set';
import { RadioButtonGroup, RadioOption } from '../../../../../../components';

/**
 * Component for creating, editing, or removing a funding.
 *
 * If the user chooses the private pay option,
 * then the given funding is removed.
 * If the user chooses CDC funding, then additional forms to
 * enter funding data are displayed as expansion content for that option
 */
export const FundingField: React.FC<FundingFormFieldProps> = ({
	error,
	errorAlertState,
	fundingId,
	fundingSpaces: allFundingSpaces,
}) => {
	const { data, dataDriller, updateData } = useGenericContext<Enrollment>(FormContext);
	const [validFundingSpaces, setValidFundingSpaces] = useState<FundingSpace[]>([]);

	useEffect(() => {
		// Set PRIVATE_PAY as the only option if:
		// - age group is not set OR
		// - there are no funding spaces OR
		// - the family has no disclosed income determination
		const ageGroup = dataDriller.at('ageGroup').value;
		const incomeNotDisclosed =
			dataDriller.at('child').at('family').at('determinations').value.length === 0;
		if (!ageGroup || !allFundingSpaces.length || incomeNotDisclosed) {
			setValidFundingSpaces([]);
			return;
		}

		// Filter valid funding spaces on enrollment ageGroup
		const _validFundingSpaces = allFundingSpaces.filter((space) => space.ageGroup === ageGroup);

		setValidFundingSpaces(_validFundingSpaces);
	}, [dataDriller, allFundingSpaces]);

	const dedupedFundingSources = Array.from(
		new Set(validFundingSpaces.map((space) => space.source as FundingSource))
	);

	const currentFundingSelection = dataDriller
		.at('fundings')
		.find((f) => f.id === fundingId)
		.at('source').value;

	return (
		<RadioButtonGroup
			name="funding-type"
			legend="Funding"
			id={`funding-type-${fundingId}`}
			defaultValue={currentFundingSelection}
			onChange={(e) =>
				updateData(
					produce<Enrollment>(data, (draft) =>
						set(
							draft,
							dataDriller
								.at('fundings')
								.find((f) => f.id === fundingId)
								.at('source').path,
							fundingSourceFromString(e.target.value)
						)
					)
				)
			}
			options={[
				// Private pay option
				{
					render: (props) => (
						<RadioButton
							{...props}
							text={prettyFundingSource(undefined)}
							onChange={() =>
								// Updates data to remove current funding
								updateData(
									produce<Enrollment>(data, (draft) =>
										set(
											draft,
											dataDriller.at('fundings').path,
											dataDriller.at('fundings').value.filter((f) => f.id !== fundingId)
										)
									)
								)
							}
						/>
					),
					value: prettyFundingSource(undefined),
				},
				// Valid funding souce options
				...dedupedFundingSources.map(
					(source) =>
						({
							render: (props) => <RadioButton text={prettyFundingSource(source)} {...props} />,
							value: source,
							expansion:
								source === FundingSource.CDC ? (
									<>
										<ContractSpaceField
											fundingId={fundingId}
											fundingSpaces={validFundingSpaces}
											error={error}
											errorAlertState={errorAlertState}
										/>
										<FirstReportingPeriodField
											fundingId={fundingId}
											error={error}
											errorAlertState={errorAlertState}
										/>
									</>
								) : undefined,
						} as RadioOption)
				),
			]}
		/>
	);
};
