import React, { useEffect, PropsWithChildren } from 'react';
import FormContext, { useGenericContext } from '../../../../../../components/Form_New/FormContext';
import { Enrollment } from '../../../../../../generated';
import produce from 'immer';
import set from 'lodash/set';

type WithNewFundingProps = {
	shouldCreate?: boolean;
}

export const WithNewFunding: React.FC<PropsWithChildren<WithNewFundingProps>> = ({
	shouldCreate,
	children: fundingFields
}) => {
	const { data, dataDriller, updateData } = useGenericContext<Enrollment>(FormContext);
	
	const newFunding = dataDriller
		.at('fundings')
		.find((cert) => cert.id === 0);


	useEffect(() => {
		if(shouldCreate && newFunding.value === undefined) {
			setTimeout(
				() => 
					updateData(
						produce<Enrollment>(data, (draft) => set(draft, newFunding.path, { id: 0 }))
					),
				0
			);
		}
	}, [shouldCreate, newFunding.value]);

	return <>{fundingFields}</>
}
