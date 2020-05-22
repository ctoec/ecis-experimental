import FormContext, { useGenericContext } from '../../../../../components/Form_New/FormContext';
import { Enrollment } from '../../../../../generated';
import React from 'react';
import Checkbox from '../../../../../components/Checkbox/Checkbox';
import produce from 'immer';
import set from 'lodash/set';

/**
 * This component is only used in NewForm, to remove all determinations.
 */
export const NotDisclosed = ({
	notDisclosed,
	setNotDisclosed,
}: {
	notDisclosed: boolean;
	setNotDisclosed: (_: boolean) => void;
}) => {
	const { data, dataDriller, updateData } = useGenericContext<Enrollment>(FormContext);
	return (
		<Checkbox
			id="not-disclosed"
			text="Family income not disclosed"
			defaultValue={notDisclosed}
			value="not-disclosed"
			onChange={e => {
				setNotDisclosed(e.target.checked);
				updateData(
					produce<Enrollment>(data, draft =>
						set(
							draft,
							dataDriller
								.at('child')
								.at('family')
								.at('determinations').path,
							[]
						)
					)
				);
			}}
		/>
	);
};
