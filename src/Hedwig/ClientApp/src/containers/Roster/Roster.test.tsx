import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import { createMemoryHistory, createBrowserHistory } from 'history';

import 'react-dates/initialize';
import mockdate from 'mockdate';
import CommonContextProviderMock from '../../contexts/__mocks__/CommonContextProviderMock';

import Roster from './Roster';
import { accessibilityTestHelper } from '../accessibilityTestHelper';
import { completeEnrollment } from '../../tests/data';

// Implicitly reads from the '../../hooks/__mocks__/useApi.ts file
jest.mock('../../hooks/useApi');

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
	useParams: () => ({
		id: 1,
	}),
}));

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
		const history = createMemoryHistory();
		const enrollment = completeEnrollment;
		history.push(`/roster/sites/${enrollment.siteId}`);
		const { asFragment } = render(
			<CommonContextProviderMock history={history}>
				<Roster />
			</CommonContextProviderMock>
		);
		expect(asFragment()).toMatchSnapshot();
	});

	it('renders intro text with the correct number of children', async () => {
		const history = createMemoryHistory();
		const enrollment = completeEnrollment;
		history.push(`/roster/sites/${enrollment.siteId}`);
		const { baseElement } = render(
			<CommonContextProviderMock history={history}>
				<Roster />
			</CommonContextProviderMock>
		);

		expect(baseElement).toHaveTextContent(/\d children enrolled/i);
	});

	it('updates the number of children', async () => {
		const { baseElement, getByText, getByPlaceholderText, getByLabelText } = render(
			<CommonContextProviderMock>
				<Roster />
			</CommonContextProviderMock>
		);

		const filterButton = getByText(/view past enrollments/i);

		fireEvent.click(filterButton);

		const byDateRange = getByLabelText(/by range/i);

		fireEvent.click(byDateRange);

		const startDateInput = getByLabelText(/start date/i);
		fireEvent.change(startDateInput, { target: { value: '01/01/2018' } });
		fireEvent.blur(startDateInput);

		const endDateInput = getByLabelText(/end date/i);
		fireEvent.change(endDateInput, { target: { value: '02/01/2019' } });
		fireEvent.blur(endDateInput);

		await wait(() => {
			expect(baseElement).toHaveTextContent(
				/\d children were enrolled between January 1, 2018 and February 1, 2019/i
			);
		});
	});

	accessibilityTestHelper(
		<CommonContextProviderMock>
			<Roster />
		</CommonContextProviderMock>
	);
});
