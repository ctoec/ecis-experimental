import React, { useState } from 'react';
import { TypeField } from "./Type";
import { FundingFormFieldProps } from "../common";
import { WithNewFunding } from './WithNewFunding';

 export const FundingField: React.FC<FundingFormFieldProps> = ({
	 fundingId,
	 initialLoad,
	 fundingSpaces
 }) => {
	const [hasFunding, setHasFunding] = useState(false);
	return (
		<WithNewFunding shouldCreate={hasFunding}>
			<TypeField 
				initialLoad={initialLoad}
				fundingId={fundingId}
				fundingSpaces={fundingSpaces}
				setHasFunding={setHasFunding}
			/>
		</WithNewFunding>
	)
 }
