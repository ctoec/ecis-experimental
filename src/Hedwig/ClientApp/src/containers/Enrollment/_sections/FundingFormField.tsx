import React, { useState } from 'react';
import FormContext, { useGenericContext } from '../../../components/Form_New/FormContext';
import { Enrollment, Site } from '../../../generated';
import { getCurrentCdcFunding_Basic } from '../../../utils/models';
import { ObjectDriller } from '../../../components/Form_New/ObjectDriller';

export const FundingFormField = (site: Site) => {
	const { data, updateData } = useGenericContext<Enrollment>(FormContext);
	const pathAccessibleData = new ObjectDriller(data);

	const currentCdcFunding = getCurrentCdcFunding_Basic(data.fundings);

	const [validFundingSources, setValidFundingSource] = useState()

	return (
		<>
			{/* <ChoiceList
				type="radio"
				legend="Funding type"
				id="fundingType"
				options=
			/> */}
		</>
	)
}
