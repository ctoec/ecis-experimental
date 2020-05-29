import React, { useEffect, useState } from 'react';
import FormContext, { useGenericContext } from '../../../../../../components/Form_New/FormContext';
import { Enrollment, FundingSource, FundingSpace } from '../../../../../../generated';
import FormField from '../../../../../../components/Form_New/FormField';
import { RadioButtonGroupProps, RadioButtonGroup } from '../../../../../../components';
import { FundingFormFieldProps } from '../common';
import { fundingSourceFromString, prettyFundingSource } from '../../../../../../utils/models';
import RadioButton from '../../../../../../components/RadioButton/RadioButton';
import { ContractSpaceField } from './ContractSpace';
import { FirstReportingPeriodField } from './FirstReportingPeriod';

export const TypeField: React.FC<FundingFormFieldProps> = ({ 
	initialLoad,
	fundingId,
	fundingSpaces: allFundingSpaces,
}) => {
	const { dataDriller } = useGenericContext<Enrollment>(FormContext);
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
			.filter(space => space.ageGroup !== ageGroup)
			
		setValidFundingSpaces(_validFundingSpaces);

	}, [dataDriller, allFundingSpaces])
	
	return (
		<div>
			<FormField<Enrollment, RadioButtonGroupProps, FundingSource | null>
				getValue={data => data.at('fundings').find(f => f.id === fundingId).at('source')}
				parseOnChangeEvent={e => fundingSourceFromString((e.target as HTMLInputElement).value)}
				inputComponent={RadioButtonGroup}
				id="funding-source-radiogroup"
				legend="Funding source"
				options={
					validFundingSpaces.map(space => ({
						render: (props) => <RadioButton text={prettyFundingSource(space.source)} {...props} />,
						value: space.source,
						expansion: space.source === FundingSource.CDC
							? (
								<>
									<ContractSpaceField initialLoad={initialLoad} fundingId={fundingId} fundingSpaces={validFundingSpaces} />
									<FirstReportingPeriodField initialLoad={initialLoad} fundingId={fundingId} lastSubmittedReport={undefined} />
								</>
							)
							: undefined
					}))
				}
			/>
		</div>
	)
}
