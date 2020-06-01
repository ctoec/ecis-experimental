import React, { useState } from 'react';
import { TypeField } from "./Type";
import { FundingFormFieldProps } from "../common";
import { WithNewFunding } from './WithNewFunding';
import FormContext, { useGenericContext } from '../../../../../../components/Form_New/FormContext';
import { Enrollment } from '../../../../../../generated';

 export const FundingField: React.FC<FundingFormFieldProps> = ({
	 fundingId,
	 initialLoad,
	 fundingSpaces
 }) => {
	const { dataDriller } = useGenericContext<Enrollment>(FormContext);
	const funding = dataDriller.at('fundings').find(f => f.id === fundingId).value;
	const [hasFunding, setHasFunding] = useState(funding != undefined);
	return (
		<>
		<WithNewFunding shouldCreate={hasFunding}>
			{/*
				ContractSpace and FirstReportingPeriod fields are instantiated
				in Type field as radio button expansion elements
			*/}
			<TypeField 
				initialLoad={initialLoad}
				fundingId={fundingId}
				fundingSpaces={fundingSpaces}
				setHasFunding={setHasFunding}
			/>
		</WithNewFunding>
		</>
	)
 }
