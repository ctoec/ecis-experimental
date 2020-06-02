import FormContext, { useGenericContext } from "../../../../../../components/Form_New/FormContext";
import { Enrollment } from "../../../../../../generated";
import React, { useEffect, PropsWithChildren } from "react";
import produce from 'immer';
import set from 'lodash/set';


type WithNewC4kCertificateProps = {
	shouldCreate: boolean;
}

export const WithNewC4kCertificate: React.FC<PropsWithChildren<WithNewC4kCertificateProps>> = ({ 
	shouldCreate,
	children: c4kCertificateFields
}) => {
	const { data, dataDriller, updateData } = useGenericContext<Enrollment>(FormContext);
	const newCert = dataDriller
		.at('child')
		.at('c4KCertificates')
		.find((cert) => cert.id === 0);

	useEffect(() => {
		if(shouldCreate && newCert.value == undefined) {
			setTimeout(() => 
				updateData(
					produce<Enrollment>(data, (draft) => set(draft, newCert.path, { id: 0}))
				), 0
			);
		}
	}, [shouldCreate, data]);

	return <>{c4kCertificateFields}</>;
}
