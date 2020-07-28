import React from 'react';
import { storiesOf } from '@storybook/react';
import { FieldSet, FormStatusProps } from '..';

const warning: FormStatusProps = {
	type: 'warning',
	message: 'These fields need your attention!',
	id: 'fieldset-warning',
};
const error: FormStatusProps = {
	type: 'error',
	message: 'These fields will block your progress!',
	id: 'fieldset-error',
};
const success: FormStatusProps = {
	type: 'success',
	message: 'These fields are filled out and validated yay!',
	id: 'fieldset-success',
};

storiesOf('FieldSet', module).add('Default', () => {
	return (
		<FieldSet legend="field set" id="default-fieldset">
			<p>I'm inside a field set!</p>
		</FieldSet>
	);
});
storiesOf('FieldSet', module)
	.add('Show legend', () => {
		return (
			<FieldSet legend="Field set" showLegend={true} id="show-legend-fieldset">
				<p>I'm inside a field set!</p>
			</FieldSet>
		);
	})
	.add('Horizontal', () => {
		return (
			<FieldSet legend="Field set" id="horizontal-fieldSet" horizontal>
				<p>These</p>
				<p>are</p>
				<p>horizontal</p>
			</FieldSet>
		);
	})
	.add('With warning', () => {
		return (
			<FieldSet legend="Warning field set" id="warning-fieldset" status={warning}>
				<p> Oh no! </p>
				<p> We have warnings! </p>
				<p> Pay attention! </p>
			</FieldSet>
		);
	})
	.add('With error', () => {
		return (
			<FieldSet legend="Error field set" id="error-fieldset" status={error}>
				<p> Uh oh! </p>
				<p> Bad stuff happening here! </p>
				<p> Fix it! </p>
			</FieldSet>
		);
	})
	.add('With success', () => {
		return (
			<FieldSet legend="Success field set" id="success-fieldset" status={success}>
				<p> Wow! </p>
				<p> You're so smart! </p>
				<p> What great form input! </p>
			</FieldSet>
		);
	});
