import React, { useEffect, useState } from 'react';
import FormContext, { useGenericContext } from '../../../../../../components/Form_New/FormContext';
import { Enrollment, FundingSource, FundingSpace } from '../../../../../../generated';
import { FundingFormFieldProps } from '../common';
import { prettyFundingSource, fundingSourceFromString } from '../../../../../../utils/models';
import RadioButton from '../../../../../../components/RadioButton/RadioButton';
import { ContractSpaceField } from './ContractSpace';
import { FirstReportingPeriodField } from './FirstReportingPeriod';
import produce from 'immer';
import set from 'lodash/set';
import { RadioButtonGroup, RadioOption } from '../../../../../../components';
import { WithNewFunding } from './WithNewFunding';
import { LastReportingPeriodField } from './LastReportingPeriod';

type FundingFieldProps = FundingFormFieldProps & {
	// see FirstReportingPeriod.tsx
	setExternalFirstReportingPeriod?: React.Dispatch<React.SetStateAction<number | undefined>>;
};

/**
 * Component for creating, editing, or removing a funding.
 *
 * If the user chooses the private pay option,
 * then the given funding is removed.
 * If the user chooses CDC funding, then additional forms to
 * enter funding data are displayed as expansion content for that option
 */
export const FundingField: React.FC<FundingFieldProps> = ({
	error,
	errorAlertState,
	fundingId,
	fundingSpaces: allFundingSpaces,
	setExternalFirstReportingPeriod,
}) => {
	const { dataDriller, updateData } = useGenericContext<Enrollment>(FormContext);
	const [validFundingSpaces, setValidFundingSpaces] = useState<FundingSpace[]>([]);

	const thisFunding = dataDriller.at('fundings').find((f) => f.id === fundingId);

	useEffect(() => {
		// Set PRIVATE_PAY as the only option if:
		// - age group is not set OR
		// - there are no funding spaces OR
		// - the family has no disclosed income determination and child is not living with foster family
		const ageGroup = dataDriller.at('ageGroup').value;
		const incomeNotDisclosed =
			dataDriller.at('child').at('family').at('determinations').value.length === 0;
		const childLivingWithFoster = dataDriller.at('child').at('foster');
		if (!ageGroup || !allFundingSpaces.length || (incomeNotDisclosed && !childLivingWithFoster)) {
			setValidFundingSpaces([]);
			return;
		}

		// Filter valid funding spaces on enrollment ageGroup
		const _validFundingSpaces = allFundingSpaces.filter((space) => space.ageGroup === ageGroup);

		setValidFundingSpaces(_validFundingSpaces);
	}, [dataDriller.at('ageGroup').value, allFundingSpaces]);

	const dedupedFundingSources = Array.from(
		new Set(validFundingSpaces.map((space) => space.source as FundingSource))
	);

	return (
		<RadioButtonGroup
			name="funding-type"
			legend="Funding"
			id={`funding-type-${fundingId}`}
			defaultValue={thisFunding.value ? thisFunding.at('source').value : 'PRIVATE_PAY'}
			options={[
				// Private pay option
				{
					render: (props) => (
						<RadioButton
							{...props}
							text={prettyFundingSource(undefined)}
							onChange={() =>
								// Remove the current funding
								updateData((_data) =>
									produce<Enrollment>(_data, (draft) =>
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
					value: 'PRIVATE_PAY',
				},
				// Valid funding souce options
				...dedupedFundingSources.map(
					(source) =>
						({
							render: (props) => <RadioButton text={prettyFundingSource(source)} {...props} />,
							value: source,
							expansion:
								source === FundingSource.CDC ? (
									<CDCOptionExpansion
										// When the Private pay option is selected, the existing funding is wiped out.
										// Even tho a non-zero fundingId exists, a new funding will need to be created
										// so we cannot rely on fundingId === 0 to determine value of shouldCreate
										shouldCreate={!thisFunding.value}
										hasLastReportingPeriod={!!thisFunding.at('lastReportingPeriodId').value}
										fundingId={fundingId}
										fundingSpaces={validFundingSpaces}
										error={error}
										errorAlertState={errorAlertState}
										setExternalFirstReportingPeriod={setExternalFirstReportingPeriod}
									/>
								) : undefined,
						} as RadioOption)
				),
			]}
		/>
	);
};

type CDCOptionExpansionProps = FundingFormFieldProps & {
	shouldCreate: boolean;
	hasLastReportingPeriod?: boolean;
	// see FirstReportingPeriod.tsx
	setExternalFirstReportingPeriod?: React.Dispatch<React.SetStateAction<number | undefined>>;
};

const CDCOptionExpansion: React.FC<CDCOptionExpansionProps> = ({
	shouldCreate,
	hasLastReportingPeriod = false,
	fundingId: existingFundingId,
	fundingSpaces: validFundingSpaces,
	error,
	errorAlertState,
	setExternalFirstReportingPeriod,
}) => {
	// If a new funding has been created, then pass sub-components
	// the new funding Id
	const fundingId = shouldCreate ? 0 : existingFundingId;

	return (
		<WithNewFunding shouldCreate={shouldCreate} source={FundingSource.CDC}>
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
				setExternalFirstReportingPeriod={setExternalFirstReportingPeriod}
			/>
			{hasLastReportingPeriod && (
				<LastReportingPeriodField
					fundingId={fundingId}
					error={error}
					errorAlertState={errorAlertState}
				/>
			)}
		</WithNewFunding>
	);
};
