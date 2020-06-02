import React from 'react';
import FormContext, { useGenericContext } from "../../../../../../components/Form_New/FormContext"
import { Enrollment } from "../../../../../../generated"
import produce from 'immer';
import set from 'lodash/set';
import Checkbox from '../../../../../../components/Checkbox/Checkbox';

type ReceivesC4KFieldProps = {
	receivesC4K: boolean;
	setReceivesC4K: (_: boolean) => void;
};

export const ReceivesC4KField: React.FC<ReceivesC4KFieldProps> = ({
	receivesC4K,
	setReceivesC4K,
}) => {
	const { data, dataDriller, updateData } = useGenericContext<Enrollment>(FormContext);
	return (
		<Checkbox
			id="receives-c4k"
			text="Receives Care 4 Kids"
			defaultValue={receivesC4K}
			onChange={(e) => {
				setReceivesC4K(e.target.checked);
				updateData(
					produce<Enrollment>(data, (draft) => 
						set(draft, dataDriller.at('child').at('c4KCertificates').path, [])
					)
				)
			}}
		/>
	)
}
