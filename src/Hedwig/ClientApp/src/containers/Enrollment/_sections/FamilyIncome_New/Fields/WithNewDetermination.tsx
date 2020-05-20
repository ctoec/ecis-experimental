import React from 'react';
import FormContext, { useGenericContext } from "../../../../../components/Form_New/FormContext"
import { Enrollment, FamilyDetermination } from "../../../../../generated"
import { PropsWithChildren, useEffect } from "react";
import { ObjectDriller } from "../../../../../components/Form_New/ObjectDriller";
import produce from "immer";
import set from 'lodash/set';


export const WithNewDetermination = ({
	shouldCreate,
	shouldCleanUp,
	children: determinationFields
}	: PropsWithChildren<{
	shouldCreate: boolean;
	shouldCleanUp: boolean;
}>) => {
	const { data, updateData } = useGenericContext<Enrollment>(FormContext);

	useEffect(() => {
		const dataDriller = new ObjectDriller<Enrollment>(data);
		const newDet = dataDriller.at('child').at('family').at('determinations').find((det: FamilyDetermination) => det.id === 0);

		if(shouldCleanUp) {
			updateData(produce<Enrollment>(
				data, draft => {set(
					draft,
					dataDriller.at('child').at('family').at('determinations').path,
					dataDriller.at('child').at('family').at('determinations').value.filter(det => det.id !== 0)
				)}
			))
		} else if(shouldCreate && newDet.value == undefined) {
			updateData(produce<Enrollment>(
				data, draft => {set(
					draft,
					newDet.path,
					{ id: 0 }
				)}
			))
		}
	}, [shouldCreate, shouldCleanUp, data]);
	
	return <>{determinationFields}</>;
}
