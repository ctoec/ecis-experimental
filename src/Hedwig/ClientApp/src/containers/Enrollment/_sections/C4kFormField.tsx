import React, { useState } from 'react';
import FormContext, { useGenericContext } from '../../../components/Form_New/FormContext';
import { Enrollment, C4KCertificate } from '../../../generated';
import FormField from '../../../components/Form_New/FormField';
import { DateInputProps, DateInput, ChoiceList } from '../../../components';
import produce from 'immer';
import set from 'lodash/set';
import Checkbox from '../../../components/Checkbox/Checkbox';
import { ObjectDriller } from '../../../components/Form_New/ObjectDriller';

export const C4kFormField = () => {
	const { data, updateData } = useGenericContext<Enrollment>(FormContext);
	const pathAccessibleData = new ObjectDriller(data);

	const [showC4kFields, setShowC4kFields] = useState(
		pathAccessibleData.at('child').at('c4KCertificates').value.length > 0
	);

	return (
		<>
			<Checkbox
				// Use case is too complicated for FormField
				defaultValue={showC4kFields}
				onChange={e => {
					const receivesC4k = !!(e.target as HTMLInputElement).checked;
					setShowC4kFields(receivesC4k);

					if (!receivesC4k) {
						// If they don't receive C4K, get rid of all certs
						updateData(produce<Enrollment>(
							data, draft => {set(
								draft,
								pathAccessibleData.at('child').at('c4KCertificates').path,
								[]
							)}
						))
					} else {
						// Otherwise create a cert with just child ID
						updateData(produce<Enrollment>(
							data, draft => {set(
								draft, 
								pathAccessibleData.at('child').at('c4KCertificates').find(cert => !cert.endDate).path,
								{ childId: data.childId }
							)}
						))
					}
				}}
				id="c4k-check-box"
				text="Receives Care 4 Kids"
				className="margin-top-3"
			/>
	
			{showC4kFields && 
				<FormField<Enrollment, DateInputProps, Date>
					getValue={data => 
						data.at('child').at('c4KCertificates').find((cert: C4KCertificate) => !cert.endDate).at('startDate')
					}
					parseOnChangeEvent={e => (e as any).toDate()}
					inputComponent={DateInput} 
					props={{
						id:'c4kcertificate-current',
						label: 'C4K Certificate'
					}}
				/>
			}
		</>
	)
}
