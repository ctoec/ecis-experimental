import React from 'react';
import { storiesOf } from '@storybook/react';
import { TextWithIcon } from '..';
import { ReactComponent as ArrowRight } from '../../assets/images/arrowRight.svg';

storiesOf('TextWithIcon', module)
	.add('Up arrow', () => {
		return (
			<TextWithIcon Icon={ArrowRight} direction="up" text="Look at stuff at the top of the page" />
		);
	})
	.add('Down arrow', () => {
		return <TextWithIcon Icon={ArrowRight} direction="down" text="Check out our sweet footer" />;
	})
	.add('Back arrow', () => {
		return (
			<TextWithIcon
				direction="left"
				Icon={ArrowRight}
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
				Icon={ArrowRight}
			/>
		);
	});
