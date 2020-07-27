import React from 'react';
import { CdcReport } from '../../../../generated';
import { Checkbox, CheckboxProps, CheckboxGroup, FormField } from '@ctoec/component-library';

type RetroactiveC4KRevenueProps = {
	disabled: boolean;
};
/**
 * Component for entering whether the entered c4k revenue includes retroactive
 * payments.
 */
export const RetroactiveC4KRevenue: React.FC<RetroactiveC4KRevenueProps> = ({ disabled }) => {
	return (
		<CheckboxGroup
			id="c4k-includes-retroactive"
			legend="Includes retroactive payment"
			options={[
				{
					render: ({ id, selected }) => (
						<FormField<CdcReport, CheckboxProps, boolean>
							getValue={(data) => data.at('retroactiveC4KRevenue')}
							parseOnChangeEvent={(e) => e.target.checked}
							defaultValue={selected}
							inputComponent={Checkbox}
							id={id}
							text="Includes retroactive payment for past months"
						/>
					),
					value: 'includes-retroactive',
				},
			]}
			disabled={disabled}
		/>
	);
};
