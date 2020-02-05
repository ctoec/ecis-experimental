import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';

import 'react-dates/initialize';
import mockdate from 'mockdate';
import CommonContextProviderMock from '../../contexts/__mocks__/CommonContextProviderMock';

import Roster from './Roster';

// Implicitly reads from the '../../hooks/__mocks__/useApi.ts file
jest.mock('../../hooks/useApi');

const fakeDate = '2019-09-30';

beforeAll(() => {
	mockdate.set(fakeDate);
});

afterAll(() => {
	mockdate.reset();
	jest.resetModules();
});

describe('Roster', () => {
	it('matches snapshot', () => {
		const { asFragment } = render(
			<CommonContextProviderMock>
				<Roster />
			</CommonContextProviderMock>
		);
		expect(asFragment()).toMatchSnapshot();
	});

	it('renders intro text with the correct number of children', async () => {
		const { baseElement } = render(
			<CommonContextProviderMock>
				<Roster />
			</CommonContextProviderMock>
		);

		expect(baseElement).toHaveTextContent(/5 children enrolled/i);
	});

	it('updates the number of children', async () => {
		const { baseElement, getByText, getByPlaceholderText } = render(
			<CommonContextProviderMock>
				<Roster />
			</CommonContextProviderMock>
		);

		const filterButton = getByText(/filter for past enrollments/i);

		fireEvent.click(filterButton);

		const byDateRange = getByText(/by range/i);

		fireEvent.click(byDateRange);

		const startDateInput = getByPlaceholderText(/start date/i);
		const endDateInput = getByPlaceholderText(/end date/i);

		fireEvent.change(startDateInput, { target: { value: '01/01/2018' } });
		fireEvent.change(endDateInput, { target: { value: '02/01/2019' } });

		await wait(() => {
			expect(baseElement).toHaveTextContent(/4 children were enrolled between January 1, 2018 and February 1, 2019/i);
		});
	});
});
