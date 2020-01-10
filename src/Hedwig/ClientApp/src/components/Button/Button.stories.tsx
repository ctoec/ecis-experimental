import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text } from '@storybook/addon-knobs';

import { Button } from '..';

const defaultText = 'Click me';
const onClick = action('onClick');

storiesOf('Button', module)
	.addDecorator(withKnobs)
	.add('Default', () => {
		const customText = text('Text', defaultText);
		return <Button text={customText} onClick={onClick} />;
	})
	.add('Base', () => {
		const customText = text('Text', defaultText);
		return <Button text={customText} appearance="base" onClick={onClick} />;
	})
	.add('Secondary', () => {
		const customText = text('Text', defaultText);
		return <Button text={customText} appearance="secondary" onClick={onClick} />;
	})
	.add('Unstyled', () => {
		const customText = text('Text', defaultText);
		return <Button text={customText} appearance="unstyled" onClick={onClick} />;
	})
	.add('Disabled', () => {
		const customText = text('Text', defaultText);
		return <Button text={customText} onClick={onClick} disabled />;
	});
