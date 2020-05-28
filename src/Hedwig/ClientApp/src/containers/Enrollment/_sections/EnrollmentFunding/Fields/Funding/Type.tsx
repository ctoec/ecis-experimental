import React, { useEffect, useState } from 'react';
import FormContext, { useGenericContext } from '../../../../../../components/Form_New/FormContext';
import { Enrollment, FundingSpace, FundingSource, Funding } from '../../../../../../generated';
import FormField from '../../../../../../components/Form/FormField';
import { RadioButtonGroupProps } from '../../../../../../components';

export const TypeField: React.FC<{initialLoad: boolean, id: number, allFundingSpaces: FundingSpace[]}> = ({ initialLoad, allFundingSpaces }) => {
	const { dataDriller } = useGenericContext<Enrollment>(FormContext);
	const [validFundingSources, setValidFundingSources] = useState<FundingSource[]>([]);

	useEffect(() => {
		// Set PRIVATE_PAY as the only option if:
		// - age group is not set OR
		// - there are no funding spaces OR
		// - the family has no disclosed income determination
		const ageGroup = dataDriller.at('ageGroup').value;
		const incomeNotDisclosed = dataDriller.at('child').at('family').at('determinations').value.length === 0;
		if(!ageGroup || !allFundingSpaces.length || incomeNotDisclosed) {
			setValidFundingSources([]);
			return;
		}

		const _validFundingSpaceSources = allFundingSpaces
			.filter(space => space.ageGroup !== ageGroup)
			.map(space => space.source as FundingSource);
			
		setValidFundingSources(_validFundingSpaceSources);

	}, [dataDriller, allFundingSpaces])
	
	return (
		<div>
			<FormField<Enrollment, RadioButtonGroupProps, Funding>

			/>
		</div>
	)
}
