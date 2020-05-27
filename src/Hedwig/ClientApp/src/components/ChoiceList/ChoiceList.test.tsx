import React from 'react';
import { render } from '@testing-library/react';
import { ChoiceList } from './ChoiceList';
import { ChoiceListExpansion } from './ChoiceListExpansion';

function createChoiceList(type: 'select' | 'radio' | 'check', selected?: string[]) {
	const commonProps = {
		id: 'id',
		options: [
			{ text: 'Option 1', value: '1' },
			{ text: 'Option 2', value: '2' },
		],
		onChange: () => {},
	};
	if (type === 'select') {
		return <ChoiceList {...commonProps} type={type} label="choice" defaultValue={selected} />;
	} else {
		return <ChoiceList {...commonProps} type={type} legend="choice" defaultValue={selected} />;
	}
}

function createChoiceListWithExpansion(type: 'select' | 'radio' | 'check', selected?: string[]) {
	const commonProps = {
		id: 'id',
		options: [
			{ text: 'Option 1', value: '1' },
			{ text: 'Option 2', value: '2' },
		],
		onChange: () => {},
	};
	const expansion = (
		<ChoiceListExpansion showOnValue="1">
			<p>My expansion</p>
		</ChoiceListExpansion>
	);
	if (type === 'select') {
		return (
			<ChoiceList {...commonProps} type={type} label="choice" defaultValue={selected}>
				{expansion}
			</ChoiceList>
		);
	} else {
		return (
			<ChoiceList {...commonProps} type={type} legend="choice" defaultValue={selected}>
				{expansion}
			</ChoiceList>
		);
	}
}

describe('select', () => {
	it('matches snapshot', () => {
		const { asFragment } = render(createChoiceList('select'));
		expect(asFragment()).toMatchSnapshot();
	});

	it('selected prop is the selected input', () => {
		const component = render(createChoiceList('select', ['1']));
		expect(component.getByDisplayValue(/Option 1/i)).toBeTruthy();
	});
});

describe('select with expansion', () => {
	it('matches snapshot', () => {
		const { asFragment } = render(createChoiceListWithExpansion('select', ['1']));
		expect(asFragment()).toMatchSnapshot();
	});

	it('expansion is showed when corresponding input selected', () => {
		const component = render(createChoiceListWithExpansion('select', ['1']));
		expect(component.getByText(/expansion/i)).toBeTruthy();
	});
});

describe('check', () => {
	it('matches snapshot', () => {
		const { asFragment } = render(createChoiceList('check'));
		expect(asFragment()).toMatchSnapshot();
	});

	it('selected prop is the selected input', () => {
		const component = render(createChoiceList('check', ['1']));
		expect((component.getByDisplayValue(/1/i) as HTMLInputElement).checked).toBeTruthy();
	});
});

describe('select with expansion', () => {
	it('matches snapshot', () => {
		const { asFragment } = render(createChoiceListWithExpansion('check', ['1']));
		expect(asFragment()).toMatchSnapshot();
	});

	it('expansion is showed when corresponding input selected', () => {
		const component = render(createChoiceListWithExpansion('check', ['1']));
		expect(component.getByText(/expansion/i)).toBeTruthy();
	});
});

describe('radio', () => {
	it('matches snapshot', () => {
		const { asFragment } = render(createChoiceList('radio'));
		expect(asFragment()).toMatchSnapshot();
	});

	it('selected prop is the selected input', () => {
		const component = render(createChoiceList('radio', ['1']));
		expect((component.getByDisplayValue(/1/i) as HTMLInputElement).checked).toBeTruthy();
	});
});

describe('radio with expansion', () => {
	it('matches snapshot', () => {
		const { asFragment } = render(createChoiceListWithExpansion('radio', ['1']));
		expect(asFragment()).toMatchSnapshot();
	});

	it('expansion is showed when corresponding input selected', () => {
		const component = render(createChoiceListWithExpansion('radio', ['1']));
		expect(component.getByText(/expansion/i)).toBeTruthy();
	});
});
