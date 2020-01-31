import React from 'react';
import { render } from '@testing-library/react';
import { ChoiceList } from './ChoiceList';

function createChoiceList(type: 'select' | 'radio' | 'check', selected?: string[]) {
	const commonProps = {
		id: 'id',
		options: [
			{ text: 'Option 1', value: '1' },
			{ text: 'Option 2', value: '2' }
		],
		onChange: () => {}
	}
	if (type === 'select') {
		return <ChoiceList
			{...commonProps}
			type={type}
			label="choice"
			selected={selected}
		/>
	} else {
		return <ChoiceList
			{...commonProps}
			type={type}
			legend="choice"
			selected={selected}
		/>
	}
}

describe('select', () => {
	it('matches snapshot', () => {
		const component = render(createChoiceList('select'));
		expect(component).toMatchSnapshot();
	});

	it('selected prop is the selected input', () => {
		const component = render(createChoiceList('select', ['1']));
		expect(component.getByDisplayValue(/Option 1/i)).toBeTruthy();
	});
});

describe('check', () => {
	it('matches snapshot', () => {
		const component = render(createChoiceList('check'));
		expect(component).toMatchSnapshot();
	});

	it('selected prop is the selected input', () => {
		const component = render(createChoiceList('check', ['1']));
		expect((component.getByDisplayValue(/1/i) as HTMLInputElement).checked).toBeTruthy()
	});
});

describe('radio', () => {
	it('matches snapshot', () => {
		const component = render(createChoiceList('radio'));
		expect(component).toMatchSnapshot();
	});

	it('selected prop is the selected input', () => {
		const component = render(createChoiceList('radio', ['1']));
		expect((component.getByDisplayValue(/1/i) as HTMLInputElement).checked).toBeTruthy()
	});
});
