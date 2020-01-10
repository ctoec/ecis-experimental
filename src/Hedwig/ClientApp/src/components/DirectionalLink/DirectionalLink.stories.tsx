import React from 'react';
import { storiesOf } from '@storybook/react';
import { DirectionalLink } from '..';

storiesOf('DirectionalLink', module)
	.add('Up arrow', () => {
		return <DirectionalLink to="/" direction="up" text="Look at stuff at the top of the page" />;
	})
	.add('Down arrow', () => {
		return <DirectionalLink to="/" direction="down" text="Check out our sweet footer" />;
	})
	.add('Back arrow', () => {
		return (
			<DirectionalLink
				to="/"
				direction="left"
				text="Look at the stuff you were looking at before"
			/>
		);
	})
	.add('Forward arrow', () => {
		return (
			<DirectionalLink
				to="/"
				direction="right"
				text="See the next thing in this series"
				arrowSide="right"
			/>
		);
	});
