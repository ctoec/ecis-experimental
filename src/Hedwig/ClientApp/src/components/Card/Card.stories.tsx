import React from 'react';
import { storiesOf } from '@storybook/react';
import { Card } from '..';
import { CardExpansion } from './CardExpansion';
import { ExpandCard } from './ExpandCard';
import { Button } from '../Button/Button';

storiesOf('Card', module)
	.add('Primary with Text', () => {
		return (
			<Card>
				<span>I am a card!</span>
			</Card>
		);
	})
	.add('Secondary with Text', () => {
		return (
			<Card appearance="secondary">
				<span>I am a card!</span>
			</Card>
		);
	})
	.add('Compact Primary with Text', () => {
		return (
			<Card className="width-max-content important">
				<span>I am a compact card!</span>
			</Card>
		);
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
	})
	.add('Secondary with Grid', () => {
		return (
			<Card appearance="secondary">
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
	})
	.add('With closed card expansion', () => {
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
				<CardExpansion>
					<div>More information here but you can't see :'(</div>
				</CardExpansion>
			</Card>
		);
	})
	.add('With open card expansion', () => {
		return (
			<Card expanded={true}>
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
				<CardExpansion>
					<div>You can see me!! :D</div>
				</CardExpansion>
			</Card>
		);
	})
	.add('With card expansion and card expander', () => {
		return (
			<Card expanded={true}>
				<div className="usa-grid">
					<div className="grid-row">
						<div className="grid-col">
							<div className="grid-row text-bold">
								<div className="grid-col">First name</div>
								<div className="grid-col">Last name</div>
							</div>
							<div className="grid-row">
								<div className="grid-col">Daniel</div>
								<div className="grid-col">Radcliff</div>
							</div>
						</div>
						<div className="grid-col">
							<ExpandCard>
								<Button appearance="unstyled" text="Click on me to toggle showing the expansion" />
							</ExpandCard>
						</div>
					</div>
				</div>
				<CardExpansion>
					<div>You can see me!! :D</div>
				</CardExpansion>
			</Card>
		);
	});
