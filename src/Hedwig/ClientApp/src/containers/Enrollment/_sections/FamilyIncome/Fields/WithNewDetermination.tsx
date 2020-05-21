import React, { useState, useEffect, PropsWithChildren } from 'react';
import FormContext, { useGenericContext } from "../../../../../components/Form_New/FormContext"
import { Enrollment } from "../../../../../generated"
import { ObjectDriller } from "../../../../../components/Form_New/ObjectDriller";
import produce from "immer";
import set from "lodash/set";


export const WithNewDetermination = ({
	shouldCreate = false,
	children: determinationFields
}	: PropsWithChildren<{
	shouldCreate: boolean;
}>) => {
	const { data, dataDriller, updateData } = useGenericContext<Enrollment>(FormContext);
	const newDet = dataDriller.at('child').at('family').at('determinations').find(det => det.id === 0);

	const [forceRerender, setForceRerender] = useState(false);
	useEffect(() => {
		if (shouldCreate && newDet.value == undefined) {
			setForceRerender(r => !r);
			updateData(produce<Enrollment>(
				data , draft => set(
					draft,
					newDet.path,
					{ id: 0 }
				)
			));
		}
	}, [shouldCreate, data, forceRerender]);

	return <>{determinationFields}</>
}
