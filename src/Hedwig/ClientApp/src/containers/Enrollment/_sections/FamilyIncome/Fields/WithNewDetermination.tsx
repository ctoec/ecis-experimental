import React, { useEffect, PropsWithChildren } from 'react';
import FormContext, { useGenericContext } from '../../../../../components/Form_New/FormContext';
import { Enrollment } from '../../../../../generated';
import produce from 'immer';
import set from 'lodash/set';

type WithNewDetermintionProps = {
	shouldCreate: boolean;
};
/**
 * A wrapping helper component that will optionally create a new determination (with id = 0).
 * Due to something funky with react's batch updates, the `updateData` call has no effect
 * when called normally. Workaround is to wrap it in a setTimeout call to force react to dispatch
 * the event.
 */
export const WithNewDetermination: React.FC<PropsWithChildren<WithNewDetermintionProps>> = ({
	shouldCreate,
	children: determinationFields,
}) => {
	const { data, dataDriller, updateData } = useGenericContext<Enrollment>(FormContext);
	const newDet = dataDriller
		.at('child')
		.at('family')
		.at('determinations')
		.find((det) => det.id === 0);

	useEffect(() => {
		if (shouldCreate && newDet.value == undefined) {
			setTimeout(() =>
				updateData(
					produce<Enrollment>(data, (draft) => set(draft, newDet.path, { id: 0 }))
				), 0
			);
		}
	}, [shouldCreate, data]);

	return <>{determinationFields}</>;
};
