import FormContext, { useGenericContext } from "../../../../../../components/Form_New/FormContext";
import { Enrollment } from "../../../../../../generated";
import React, { useEffect } from "react";
import produce from "immer";
import { set } from "immer/dist/common";

type WithNewFundingProps = {
	shouldCreate: boolean;
}

export const WithNewFunding: React.FC<WithNewFundingProps> = ({
	shouldCreate = false,
	children: fundingFields
}) => {
	const { data, dataDriller, updateData } = useGenericContext<Enrollment>(FormContext);
	const newFunding = dataDriller
		.at('fundings')
		.find((f) => f.id === 0);

		useEffect(() => {
		if (shouldCreate && newFunding.value == undefined) {
			setTimeout(
				() =>
					updateData(
						produce<Enrollment>(data, (draft) => set(draft, newFunding.path, { id: 0 }))
					),
				0
			);
		}
	}, [shouldCreate, data]);

	return <>{fundingFields}</>;

}
