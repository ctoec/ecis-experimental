// Variables used in jest mockes -- must start with `mock`
import {
	mockAllFakeEnrollments,
	mockSingleSiteOrganization,
	mockEnrollmentMissingAddress,
	mockMultiSiteOrganization,
} from '../../tests/data';
import mockUseApi, {
	mockApiOrganizationsOrgIdEnrollmentsGet,
	mockApiOrganizationsIdGet,
} from '../../hooks/useApi/__mocks__/useApi';

let mockOrganization = mockSingleSiteOrganization;
let mockEnrollments = mockAllFakeEnrollments;
// Jest mocks must occur before later imports
jest.mock('../../hooks/useApi', () => ({
	// When trying to mock both a default import and named import,
	// we must specify __esModule: true on the returned object.
	__esModule: true,
	default: mockUseApi({
		apiOrganizationsIdGet: (_: any) => mockApiOrganizationsIdGet(mockOrganization)(_),
		apiOrganizationsOrgIdEnrollmentsGet: (_: any) =>
			mockApiOrganizationsOrgIdEnrollmentsGet(mockEnrollments)(_),
	}),
	paginate: (_: any, __: any) => _,
}));

let mockSiteId: number | undefined = 1;
jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
	useParams: () => ({
		id: mockSiteId,
	}),
}));

import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import { createMemoryHistory } from 'history';

import 'react-dates/initialize';
import mockdate from 'mockdate';

import { accessibilityTestHelper } from '../../tests/helpers';
import TestProvider from '../../contexts/__mocks__/TestProvider';

import Roster from './Roster';
import idx from 'idx';

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

	describe('given an enrollment with missing information', () => {
		beforeEach(() => {
			mockEnrollments = [mockEnrollmentMissingAddress];
		});

		it('it renders a missing information notice in legend', () => {
			const { getByText } = render(
				<TestProvider>
					<Roster />
				</TestProvider>
			);

			const missingInformation = getByText(/missing information/);
			expect(missingInformation.previousSibling).toHaveTextContent(/1/);
		});

		it('it renders a missing infomration notice in roster table', () => {
			const { getByText } = render(
				<TestProvider>
					<Roster />
				</TestProvider>
			);

			const childNameRegex = new RegExp(
				`${idx(mockEnrollmentMissingAddress, (_) => _.child.firstName)}`
			);
			const childCell = getByText(childNameRegex);
			const missingInformation = childCell.nextElementSibling;
			expect(missingInformation).not.toBeNull();
		});
	});

	describe('given a single site organization', () => {
		beforeEach(() => {
			// Set page to render as /roster
			mockSiteId = undefined;
		});

		it('clicking enroll child brings up the enrollment flow', async () => {
			const history = createMemoryHistory();
			const { getByText } = render(
				<TestProvider history={history}>
					<Roster />
				</TestProvider>
			);

			const enrollBtn = getByText(/Enroll child/);
			fireEvent.click(enrollBtn);

			expect(history.location.pathname).toMatch(/enroll/);
		});
	});

	describe('given a multi site organization', () => {
		beforeEach(() => {
			// Set page to render as /roster
			mockSiteId = undefined;
			mockOrganization = mockMultiSiteOrganization;
		});

		it('clicking enroll child shows site dropdown', async () => {
			const history = createMemoryHistory();
			const { getByText } = render(
				<TestProvider history={history}>
					<Roster />
				</TestProvider>
			);

			const enrollBtn = getByText(/Enroll child/).closest('button');
			expect(enrollBtn).not.toBeNull();
			if (enrollBtn === null) {
				throw new Error('Typescript guarding');
			}
			fireEvent.click(enrollBtn);

			expect(history.location.pathname).not.toMatch(/enroll/);

			const dropdown = enrollBtn.nextElementSibling;

			expect(dropdown).not.toBeNull();
			if (dropdown === null) {
				throw new Error('Typescript guarding');
			}

			expect(dropdown.childElementCount).toBe((mockMultiSiteOrganization.sites || []).length);
		});
	});

	accessibilityTestHelper(
		<TestProvider>
			<Roster />
		</TestProvider>
	);
});
