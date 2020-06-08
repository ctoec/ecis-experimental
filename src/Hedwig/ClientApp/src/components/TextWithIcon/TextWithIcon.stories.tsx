import React from 'react';
import { storiesOf } from '@storybook/react';
import { TextWithIcon } from '..';

storiesOf('TextWithIcon', module)
	.add('Up arrow', () => {
		return (
			<TextWithIcon
				imageFileName="arrowRight"
				direction="up"
				text="Look at stuff at the top of the page"
			/>
		);
	})
	.add('Down arrow', () => {
		return (
			<TextWithIcon imageFileName="arrowRight" direction="down" text="Check out our sweet footer" />
		);
	})
	.add('Back arrow', () => {
		return (
			<TextWithIcon
				direction="left"
				imageFileName="arrowRight"
				text="Look at the stuff you were looking at before"
			/>
		);
	})
	.add('Forward arrow', () => {
		return (
			<TextWithIcon
				direction="right"
				text="See the next thing in this series"
				iconSide="right"
				imageFileName="arrowRight"
			/>
		);
	});
