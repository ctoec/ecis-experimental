import React from 'react';
import { storiesOf } from '@storybook/react';
import Fieldset from './FieldSet';
import { FormErrorProps } from '../FormError/FormError';

const warning: FormErrorProps = { type: 'warning', message: 'These fields need your attention!' };
const error: FormErrorProps = { type: 'error', message: 'These fields will block your progress!' };
storiesOf('FieldSet', module).add('Default', () => {
	return (
		<Fieldset legend="field set" id="default-fieldset">
			<p>I'm inside a field set!</p>
		</Fieldset>
	);
});
storiesOf('FieldSet', module)
	.add('Show legend', () => {
		return (
			<Fieldset legend="Field set" showLegend={true} id="show-legend-fieldset">
				<p>I'm inside a field set!</p>
			</Fieldset>
		);
	})
	.add('With warning', () => {
		return (
			<Fieldset legend="Warning field set" id="warning-fieldset" error={warning}>
				<p> Oh no! </p>
				<p> We have warnings! </p>
				<p> Pay attention! </p>
			</Fieldset>
		);
	})
	.add('With error', () => {
		return (
			<Fieldset legend="Error field set" id="error-fieldset" error={error}>
				<p> Uh oh! </p>
				<p> Bad stuff happening here! </p>
				<p> Fix it! </p>
			</Fieldset>
		);
	});
