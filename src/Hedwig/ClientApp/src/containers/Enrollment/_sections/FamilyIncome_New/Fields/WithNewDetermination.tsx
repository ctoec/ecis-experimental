import React, { useState, useEffect, PropsWithChildren } from 'react';
import FormContext, { useGenericContext } from "../../../../../components/Form_New/FormContext"
import { Enrollment } from "../../../../../generated"
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
	console.log("with new det data", data);
	const dataDriller = new ObjectDriller<Enrollment>(data);
	const newDet = dataDriller.at('child').at('family').at('determinations').find(det => det.id === 0);

	const [rerender, setRerender] = useState(0);
	useEffect(() => {
		if(shouldCleanUp && newDet.value != undefined) {
			console.log("remove");
			setRerender(r => r + 1);
			updateData(produce<Enrollment>(
				data, draft => set(
					draft,
					dataDriller.at('child').at('family').at('determinations').path,
					dataDriller.at('child').at('family').at('determinations').value.filter(det => det.id !== 0)
				)
			))
		} else if (shouldCreate && newDet.value == undefined) {
			console.log("is create");
			updateData(_data => produce<Enrollment>(
				_data , draft => set(
					draft,
					newDet.path,
					{ id: 0, numberOfPeople: 0 }
				)
			));
			setRerender(r => r +1 );
		}
	}, [shouldCreate, shouldCleanUp, JSON.stringify(data)]);

	return <React.Fragment key={rerender}>
		<div>{JSON.stringify(data)}</div>
		{determinationFields}
		</React.Fragment>
	// options:
	// - map over children, update their key
	// - possible to add
}
