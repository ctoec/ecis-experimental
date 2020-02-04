import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import 'react-dates/initialize';
import mockdate from 'mockdate';
import CommonContextProviderMock from '../../contexts/__mocks__/CommonContextProviderMock';

import Roster from './Roster';

const fakeDate = '2019-09-30';

jest.mock('../../hooks/useApi');

beforeAll(() => {
	mockdate.set(fakeDate);
});

afterAll(() => {
	mockdate.reset();
	jest.resetModules();
});

describe('Roster', () => {
	it('matches snapshot', () => {
		const component = render(
			<CommonContextProviderMock>
				<Roster />
			</CommonContextProviderMock>
		);
		expect(component).toMatchSnapshot();
	});

	it('renders intro text with the correct number of children', async () => {
		const { baseElement } = render(
			<CommonContextProviderMock>
				<Roster />
			</CommonContextProviderMock>
		);

		expect(baseElement).toHaveTextContent(/2 children enrolled/i);
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

		expect(baseElement).toHaveTextContent(/1 child was enrolled between January 1, 2018 and February 1, 2019/i);
	});
});
