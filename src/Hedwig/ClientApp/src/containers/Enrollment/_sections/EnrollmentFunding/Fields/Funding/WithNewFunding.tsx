import React, { useEffect, PropsWithChildren } from 'react';
import { useGenericContext, FormContext } from '@ctoec/component-library';
import { Enrollment, FundingSource } from '../../../../../../generated';
import produce from 'immer';
import set from 'lodash/set';

type WithNewFundingProps = {
	shouldCreate?: boolean;
	source: FundingSource;
};

export const WithNewFunding: React.FC<PropsWithChildren<WithNewFundingProps>> = ({
	shouldCreate,
	source,
	children: fundingFields,
}) => {
	const { dataDriller, updateData } = useGenericContext<Enrollment>(FormContext);

	const newFunding = dataDriller.at('fundings').find((funding) => funding.id === 0);
	useEffect(() => {
		if (shouldCreate && newFunding.value === undefined) {
			setTimeout(
				() =>
					updateData((_data) =>
						produce<Enrollment>(_data, (draft) => set(draft, newFunding.path, { id: 0, source }))
					),
				0
			);
		}
	}, [shouldCreate, newFunding.value]);

	return <>{fundingFields}</>;
};
