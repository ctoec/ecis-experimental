// Variables used in jest mockes -- must start with `mock`
import { mockAllFakeEnrollments, mockOrganization } from '../../tests/data';
import mockUseApi, {
	mockApiOrganizationsOrgIdEnrollmentsGet,
	mockApiOrganizationsIdGet,
} from '../../hooks/__mocks__/useApi';

// Jest mocks must occur before later imports
jest.mock('../../hooks/useApi', () =>
	mockUseApi({
		apiOrganizationsIdGet: mockApiOrganizationsIdGet(mockOrganization),
		apiOrganizationsOrgIdEnrollmentsGet: mockApiOrganizationsOrgIdEnrollmentsGet(
			mockAllFakeEnrollments
		),
	})
);

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
	useParams: () => ({
		id: 1,
	}),
}));

import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';

import 'react-dates/initialize';
import mockdate from 'mockdate';

import { accessibilityTestHelper } from '../accessibilityTestHelper';
import TestProvider from '../../contexts/__mocks__/TestProvider';

import Roster from './Roster';

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
			<TestProvider>
				<Roster />
			</TestProvider>
		);
		expect(asFragment()).toMatchSnapshot();
	});

	it('renders intro text with the correct number of children', async () => {
		const { baseElement } = render(
			<TestProvider>
				<Roster />
			</TestProvider>
		);

		expect(baseElement).toHaveTextContent(/\d children enrolled/i);
	});

	it('updates the number of children', async () => {
		const { baseElement, getByText, getByLabelText } = render(
			<TestProvider>
				<Roster />
			</TestProvider>
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
		<TestProvider>
			<Roster />
		</TestProvider>
	);
});
