import React from 'react';
import { render, act } from '@testing-library/react';
import { Card } from './Card';
import { CardExpansion } from './CardExpansion';
import { ExpandCard } from './ExpandCard';

it('matches snapshot', () => {
	const { asFragment } = render(
		<Card>
			<p>Hi there</p>
		</Card>
	);
	expect(asFragment()).toMatchSnapshot();
});

describe('card with card expansion', () => {
	it('does not render expansion when expanded is false', () => {
		const { getByText, queryByText } = render(
			<Card expanded={false}>
				<p>Shown</p>
				<CardExpansion>Hidden</CardExpansion>
			</Card>
		);
		const shownNode = getByText('Shown');
		expect(shownNode).toBeVisible();
		expect(queryByText('Hidden')).toBeNull();
	});

	it('shows expansion when expanded is true', () => {
		const { getByText } = render(
			<Card expanded={true}>
				<p>Shown</p>
				<CardExpansion>Hidden</CardExpansion>
			</Card>
		);
		const shownNode = getByText('Shown');
		expect(shownNode).toBeVisible();
		const hiddenNode = getByText('Hidden');
		expect(hiddenNode).toBeVisible();
	});

	it('expand card toggles expansion state when clicked', () => {
		const { getByText, queryByText } = render(
			<Card>
				<div>
					<p>Shown</p>
					<ExpandCard>
						<p>Toggle</p>
					</ExpandCard>
				</div>
				<CardExpansion>Hidden</CardExpansion>
			</Card>
		);

		const shownNode = getByText('Shown');
		expect(shownNode).toBeVisible();
		expect(queryByText('Hidden')).toBeNull();

		const toggle = getByText('Toggle');
		toggle.click();

		expect(shownNode).toBeVisible();

		const hiddenNode = getByText('Hidden');
		expect(hiddenNode).toBeVisible();
	});

	it('onExpansionChange is triggered when clicked', () => {
		const onExpansion = jest.fn();
		const { getByText } = render(
			<Card onExpansionChange={onExpansion}>
				<div>
					<p>Shown</p>
					<ExpandCard>
						<p>Toggle</p>
					</ExpandCard>
				</div>
				<CardExpansion>Hidden</CardExpansion>
			</Card>
		);

		expect(onExpansion).toHaveBeenCalledTimes(0);

		const toggle = getByText('Toggle');
		act(() => toggle.click());

		expect(onExpansion).toHaveBeenCalledTimes(1);

		act(() => toggle.click());

		expect(onExpansion).toHaveBeenCalledTimes(2);
	});

	it('changing forceClose to true closes the expansion', () => {
		let forceClose = false;
		const onExpansion = () => (forceClose = true);
		const { getByText, queryByText } = render(
			<Card onExpansionChange={onExpansion} expanded={true} forceClose={forceClose}>
				<div>
					<p>Shown</p>
					<ExpandCard>
						<p>Toggle</p>
					</ExpandCard>
				</div>
				<CardExpansion>Hidden</CardExpansion>
			</Card>
		);

		const shownNode = getByText('Shown');
		const hiddenNode = getByText('Hidden');
		expect(shownNode).toBeVisible();
		expect(hiddenNode).toBeVisible();

		const toggle = getByText('Toggle');
		act(() => toggle.click());

		expect(shownNode).toBeVisible();
		expect(queryByText('Hidden')).toBeNull();
	});
});
