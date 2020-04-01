import React from 'react';
import { storiesOf } from '@storybook/react';
import { Card } from '..';

storiesOf('Card', module)
	.add('Primary with Text', () => {
		return <Card>I am a card!</Card>;
	})
	.add('Secondary with Text', () => {
		return <Card appearance="secondary">I am a card!</Card>;
	})
	.add('Primary with Grid', () => {
		return (
			<Card>
				<div className="usa-grid">
					<div className="grid-row text-bold">
						<div className="grid-col">First name</div>
						<div className="grid-col">Last name</div>
					</div>
					<div className="grid-row">
						<div className="grid-col">Daniel</div>
						<div className="grid-col">Radcliff</div>
					</div>
				</div>
			</Card>
		);
	});
