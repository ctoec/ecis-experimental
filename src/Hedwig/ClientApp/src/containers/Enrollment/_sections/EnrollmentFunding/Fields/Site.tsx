import { EnrollmentFormFieldProps } from './common';
import { FormField } from '../../../../../components/Form_New';
import React from 'react';
import { Enrollment, Age, Site } from '../../../../../generated';
import { RadioButtonGroupProps, RadioButtonGroup } from '../../../../../components';
import RadioButton from '../../../../../components/RadioButton/RadioButton';

type SiteFieldProps = EnrollmentFormFieldProps & {
	sites: Site[];
	previousEnrollmentSiteId?: number;
};
export const SiteField: React.FC<SiteFieldProps> = ({ sites, previousEnrollmentSiteId }) => {
	return (
		<FormField<Enrollment, RadioButtonGroupProps, number | null>
			defaultValue={previousEnrollmentSiteId}
			getValue={(data) => data.at('siteId')}
			parseOnChangeEvent={(e) => parseInt((e.target as HTMLInputElement).value)}
			inputComponent={RadioButtonGroup}
			name="site"
			id="site-radiogroup"
			legend="Site"
			showLegend
			legendStyle="title"
			options={sites.map((site) => ({
				render: (props) => <RadioButton text={`${site.name}`} {...props} />,
				value: `${site.id}`,
			}))}
		/>
	);
};
