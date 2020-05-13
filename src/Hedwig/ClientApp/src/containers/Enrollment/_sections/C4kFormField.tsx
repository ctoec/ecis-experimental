import React, { useState, useEffect } from 'react';
import FormContext, { useGenericContext } from '../../../components/Form_New/FormContext';
import { Enrollment, C4KCertificate } from '../../../generated';
import FormField, { PathAccessor } from '../../../components/Form_New/FormField';
import { DateInputProps, DateInput, ChoiceList } from '../../../components';
import idx from 'idx';
import produce from 'immer';
import omit from 'lodash/omit';
import set from 'lodash/set';

export const C4kFormField = () => {
	const { data, updateData } = useGenericContext<Enrollment>(FormContext);
	const [showC4kFields, setShowC4kFields] = useState(
		idx(data, _ => _.child.c4KCertificates.length > 0) || false
	);

	const pathAccessibleData = new PathAccessor(data);
	
	return (
		<>
			<ChoiceList
				type="check"
				defaultValue={showC4kFields ? ['receives-c4k'] : undefined}
				options={[
					{
						text: 'Receives Care 4 Kids',
						value: 'receives-c4k',
					},
				]}
				onChange={e => {
					const receivesC4k = !!(e.target as HTMLInputElement).checked;
					setShowC4kFields(receivesC4k);

					if (!receivesC4k) {
						updateData(produce<Enrollment>(
							data, draft => {omit(
								draft,
								pathAccessibleData.at('child').at('c4KCertificates').find(cert => !cert.endDate).path
							)}
						))
					} else {
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
				legend="Receives Care 4 Kids"
				className="margin-top-3"
			/>
	
			{showC4kFields && 
				<FormField<Enrollment, DateInputProps, Date>
					type='simple'
					preprocessForUpdate={e => (e as any).toDate()}
					getValue={data => 
						data.at('child').at('c4KCertificates').find((cert: C4KCertificate) => !cert.endDate).at('startDate')
					}
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
