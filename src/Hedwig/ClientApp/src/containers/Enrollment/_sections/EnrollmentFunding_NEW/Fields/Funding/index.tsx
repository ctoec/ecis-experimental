import React, { useEffect, useState } from 'react';
import FormContext, { useGenericContext } from '../../../../../../components/Form_New/FormContext';
import { Enrollment, FundingSource, FundingSpace, Funding } from '../../../../../../generated';
import FormField from '../../../../../../components/Form_New/FormField';
import { FundingFormFieldProps } from '../common';
import { prettyFundingSource } from '../../../../../../utils/models';
import RadioButton, { RadioButtonProps } from '../../../../../../components/RadioButton/RadioButton';
import { ContractSpaceField } from './ContractSpace';
import { FirstReportingPeriodField } from './FirstReportingPeriod';
import { FormFieldSet } from '../../../../../../components/Form_New/FormFieldSet';
import { RadioButtonGroup, RadioOption } from '../../../../../../components/RadioButtonGroup_NEW/RadioButtonGroup';
import produce from 'immer';
import set from 'lodash/set';


export const FundingField: React.FC<FundingFormFieldProps> = ({ 
	initialLoad,
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
		const incomeNotDisclosed = dataDriller.at('child').at('family').at('determinations').value.length === 0;
		if(!ageGroup || !allFundingSpaces.length || incomeNotDisclosed) {
			setValidFundingSpaces([]);
			return;
		}

		const _validFundingSpaces = allFundingSpaces
			.filter(space => space.ageGroup === ageGroup)
			
		setValidFundingSpaces(_validFundingSpaces);

	}, [dataDriller, allFundingSpaces])


	const dedupedFundingSources = Array.from(new Set(
		validFundingSpaces.map(space => space.source as FundingSource)
	));

	return (
		<FormFieldSet
			legend="Funding"
			id="funding"
			showLegend
			legendStyle="title"
		>
			<RadioButtonGroup
				id="funding-type-radiogroup"
				name="funding-type"
				options={[
					// Private pay option
					{
						render: (props) => (
							<RadioButton
								text={prettyFundingSource(undefined)}
								onChange={() => 
									updateData(
										produce<Enrollment>(data, (draft) => set(
											draft,
											dataDriller.at('fundings').path,
											dataDriller.at('fundings').value.filter(f => f.id !== fundingId)
										))
									)
								}
								{...props}
							/>
						),
						value: prettyFundingSource(undefined)
					},
					...dedupedFundingSources.map(source => ({
						render: (props) => (
							<FormField<Enrollment, RadioButtonProps, Funding>
								getValue={data => data.at('fundings').find(f => f.id === fundingId)}
								parseOnChangeEvent={() => ({id: fundingId, source} as Funding)}
								inputComponent={RadioButton}
								text={prettyFundingSource(source)}
								{...props}
							/>
						),
						value: source,
						expansion: source === FundingSource.CDC
							? (
								<>
									<ContractSpaceField initialLoad={initialLoad} fundingId={fundingId} fundingSpaces={validFundingSpaces} />
									<FirstReportingPeriodField initialLoad={initialLoad} fundingId={fundingId} />
								</>
							)
							: undefined
					}) as RadioOption)
				]}
			/>
		</FormFieldSet>
	)
}
