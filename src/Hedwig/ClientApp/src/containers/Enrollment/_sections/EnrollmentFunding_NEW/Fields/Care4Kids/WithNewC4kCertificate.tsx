import FormContext, { useGenericContext } from '../../../../../../components/Form_New/FormContext';
import { Enrollment } from '../../../../../../generated';
import React, { useEffect, PropsWithChildren, useState } from 'react';
import produce from 'immer';
import set from 'lodash/set';
import moment from 'moment';
import { enrollmentDetailMetadataFormatter } from '../../../../../../utils/stringFormatters';

type WithNewC4kCertificateProps = {
	shouldCreate: boolean;
	endLastCert?: boolean;
};

// Used in new flow, also in edit flow when user needs to re-certify
export const WithNewC4kCertificate: React.FC<PropsWithChildren<WithNewC4kCertificateProps>> = ({
	shouldCreate,
	children: c4kCertificateFields,
}) => {
	const { data, dataDriller, updateData } = useGenericContext<Enrollment>(FormContext);

	// Reusable accessor for the new certificate (id = 0)
	const newCert = dataDriller
		.at('child')
		.at('c4KCertificates')
		.find((cert) => cert.id === 0);

	// State var to hold the Id for the previously active cert
	// (Have to determine the Id at new-cert-creation time, and then
	// reuse this Id to continue updating the cert as new-cert start
	// date changes. Cannot continue to access previous cert with missing
	// end date predicate, as we set the end date!)
	const [activePreviousCertId, setActivePreviousCertId] = useState<number>();

	// Create the new certificate if it does not exist,
	// and capture the Id of the previously active cert
	useEffect(() => {
		if (shouldCreate && newCert.value === undefined) {
			console.log('set');
			setActivePreviousCertId(
				dataDriller
					.at('child')
					.at('c4KCertificates')
					.find((cert) => cert.id !== 0 && !cert.endDate)
					.at('id').value
			);
			setTimeout(
				() =>
					updateData(
						produce<Enrollment>(data, (draft) => set(draft, newCert.path, { id: 0 }))
					),
				0
			);
		}
	}, [shouldCreate, newCert.value]);

	// Update the previously active cert end date to one date before
	// the new cert start date
	useEffect(() => {
		const activePreviousCert = dataDriller
			.at('child')
			.at('c4KCertificates')
			.find((cert) => cert.id === activePreviousCertId);
		const newCertStart = newCert.at('startDate').value;
		const prevCertEnd = newCertStart
			? moment.utc(newCert.at('startDate').value).add(-1, 'days').toDate()
			: undefined;
		if (
			activePreviousCert.value != undefined &&
			activePreviousCert.at('endDate').value !== prevCertEnd
		) {
			setTimeout(
				() =>
					updateData(
						produce<Enrollment>(data, (draft) =>
							set(draft, activePreviousCert.path, {
								...activePreviousCert.value,
								endDate: prevCertEnd,
							})
						)
					),
				0
			);
		}
	}, [shouldCreate, newCert.value, activePreviousCertId]);

	return <>{c4kCertificateFields}</>;
};
