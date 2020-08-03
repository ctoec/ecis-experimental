import { Enrollment } from '../../../../../generated';
import React from 'react';
import produce from 'immer';
import set from 'lodash/set';
import { useGenericContext, FormContext } from '@ctoec/component-library';
import { Checkbox } from '../../../../../components';

type NotDisclosedFieldProps = {
	notDisclosed: boolean;
	setNotDisclosed: (_: boolean) => void;
};

/**
 * This component is only used in NewForm, to remove all determinations.
 */
export const NotDisclosedField: React.FC<NotDisclosedFieldProps> = ({
	notDisclosed,
	setNotDisclosed,
}) => {
	const { data, dataDriller, updateData } = useGenericContext<Enrollment>(FormContext);
	return (
		<Checkbox
			id="not-disclosed"
			value="not-disclosed"
			text="Family income not disclosed"
			defaultValue={notDisclosed}
			onChange={(e) => {
				setNotDisclosed(e.target.checked);
				updateData(
					produce<Enrollment>(data, (draft) =>
						set(draft, dataDriller.at('child').at('family').at('determinations').path, [])
					)
				);
			}}
		/>
	);
};
