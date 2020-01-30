import React from 'react';
import { render } from '@testing-library/react';
import { ChoiceList } from './ChoiceList';

describe('select', () => {
	it('matches snapshot', () => {
		const component = render(
			<ChoiceList
				id="id"
				type="select"
				label="choice"
				options={[
					{ text: 'Option 1', value: '1' },
					{ text: 'Option 2', value: '2' }
				]}
				onChange={() => {}}
			/>
		);
	
		expect(component).toMatchSnapshot();
	});

	it('selected prop is the selected input', () => {
		const component = render(
			<ChoiceList
				id="id"
				type="select"
				label="choice"
				options={[
					{ text: 'Option 1', value: '1' },
					{ text: 'Option 2', value: '2' }
				]}
				onChange={() => {}}
				selected={['1']}
			/>
		);

		expect(component.getByDisplayValue(/Option 1/i)).toBeTruthy();
	});
});

describe('check', () => {
	it('matches snapshot', () => {
		const component = render(
			<ChoiceList
				id="id"
				type="check"
				legend="choice"
				options={[
					{ text: 'Option 1', value: '1' },
					{ text: 'Option 2', value: '2' }
				]}
				onChange={() => {}}
			/>
		);
	
		expect(component).toMatchSnapshot();
	});

	it('selected prop is the selected input', () => {
		const component = render(
			<ChoiceList
				id="id"
				type="check"
				legend="choice"
				options={[
					{ text: 'Option 1', value: '1' },
					{ text: 'Option 2', value: '2' }
				]}
				onChange={() => {}}
				selected={['1']}
			/>
		);

		expect((component.getByDisplayValue(/1/i) as HTMLInputElement).checked).toBeTruthy()
	});
});

describe('radio', () => {
	it('matches snapshot', () => {
		const component = render(
			<ChoiceList
				id="id"
				type="radio"
				legend="choice"
				options={[
					{ text: 'Option 1', value: '1' },
					{ text: 'Option 2', value: '2' }
				]}
				onChange={() => {}}
			/>
		);
	
		expect(component).toMatchSnapshot();
	});

	it('selected prop is the selected input', () => {
		const component = render(
			<ChoiceList
				id="id"
				type="radio"
				legend="choice"
				options={[
					{ text: 'Option 1', value: '1' },
					{ text: 'Option 2', value: '2' }
				]}
				onChange={() => {}}
				selected={['1']}
			/>
		);

		expect((component.getByDisplayValue(/1/i) as HTMLInputElement).checked).toBeTruthy()
	});
});
