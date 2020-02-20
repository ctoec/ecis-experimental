import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text } from '@storybook/addon-knobs';
import { Tag } from '..';

const defaultText = 'I AM A TAG';

storiesOf('Tag', module)
	.addDecorator(withKnobs)
	.add('Default', () => {
		const customText = text('Text', defaultText);
		return <Tag text={customText} />;
	});
