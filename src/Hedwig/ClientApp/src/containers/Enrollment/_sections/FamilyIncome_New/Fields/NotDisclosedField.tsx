import React, { PropsWithChildren, useState, useEffect } from "react";
import { useGenericContext } from "../../../../../components/Form_New/FormContext";
import { Enrollment, FamilyDetermination } from "../../../../../generated";
import FormContext from "../../../../../components/Form_New/FormContext";
import { ObjectDriller } from "../../../../../components/Form_New/ObjectDriller";
import { hasValidationErrors } from "../../../../../utils/validations";
import { Alert } from "../../../../../components";
import Checkbox from "../../../../../components/Checkbox/Checkbox";
import produce from "immer";
import set  from "lodash/set";

export const WithNotDisclosedField = ({children: otherFields}: PropsWithChildren<{}>) => {
	const { data, updateData } = useGenericContext<Enrollment>(FormContext);
	const dataDriller = new ObjectDriller<Enrollment>(data);

	const det = dataDriller.at('child').at('family').at('determinations').find((det: FamilyDetermination) => det.id === 0).value as FamilyDetermination;
	const [hideOtherFields, setHideOtherFields] = useState(det.notDisclosed);
	const [displayAlert, setDisplayAlert] = useState(det.notDisclosed && !hasValidationErrors(det))
	
	useEffect(() => {
		setDisplayAlert(det.notDisclosed && !hasValidationErrors(det));
	}, [det]);

	return (
		<>
			{!hideOtherFields &&
				otherFields
			}

			<Checkbox
				id='not-disclosed'
				text="Family income not disclosed"
				value="not-disclosed"
				onChange={e => {
					const notDisclosed = e.target.checked;
					setHideOtherFields(notDisclosed);
					
					if (notDisclosed) {
						updateData(produce<Enrollment>(
							data, draft => {set(
								draft,
								dataDriller.at('child').at('family').at('determinations').find((det: FamilyDetermination) => det.id === 0).path,
								{notDisclosed: true} as FamilyDetermination
							)}
						));
					} else {
						updateData(produce<Enrollment>(
							data, draft => {set(
								draft, 
								dataDriller.at('child').at('family').at('determinations').find((det: FamilyDetermination) => det.id === 0).path,
								{notDisclosed: false}
							)}
						))
					}
				}}
			/>
			{displayAlert &&
				<Alert
					type="info"
					text="Income information is required enroll a child in a funded space. You will not be able to assign this child to a funding space without this information."
				/>
			}
		</>
	);
}
