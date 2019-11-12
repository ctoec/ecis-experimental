import React from 'react';
import moment from 'moment';
import { mount } from 'enzyme';
import mockdate from 'mockdate';
import { BrowserRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import { MockedProvider } from '@apollo/react-testing';
import 'react-dates/initialize';
import Roster, { ROSTER_QUERY } from './Roster';
import DateSelectionForm from './DateSelectionForm';
import RadioGroup from '../../components/RadioGroup/RadioGroup';

const fakeDate = '2019-09-30';

const earlierFakeEnrollment = {
	child: {
		id: 1,
		firstName: 'James',
		middleName: 'Sirius',
		lastName: 'Potter',
		birthdate: '2015-04-28',
		suffix: null,
	},
	entry: '2019-01-01',
	exit: null,
	fundings: [],
	id: 1,
	age: 'preschool',
};
const laterFakeEnrollment = {
	child: {
		id: 2,
		firstName: 'Lily',
		middleName: 'Luna',
		lastName: 'Potter',
		birthdate: '2016-12-12',
		suffix: null,
	},
	entry: '2019-03-03',
	exit: null,
	fundings: [
		{
			entry: '2019-03-01',
			exit: '2019-04-01',
			source: 'CDC',
			time: 'part',
		},
	],
	id: 2,
	age: 'preschool',
};

const mocks = [
	{
		request: {
			query: ROSTER_QUERY,
			variables: {
				from: fakeDate,
				to: fakeDate,
			},
		},
		result: {
			data: {
				me: {
					sites: [
						{
							id: 1,
							name: 'Site 1',
							enrollments: [earlierFakeEnrollment, laterFakeEnrollment],
						},
					],
				},
			},
		},
	},
	{
		request: {
			query: ROSTER_QUERY,
			variables: { from: '2018-01-01', to: '2019-02-01' },
		},
		result: {
			data: {
				me: {
					sites: [
						{
							id: 1,
							name: 'Site 1',
							enrollments: [earlierFakeEnrollment],
						},
					],
				},
			},
		},
	},
];

const waitForUpdate = async (wrapper: any) => {
	await new Promise(resolve => setTimeout(resolve, 10));
	wrapper.update();
};

beforeAll(() => {
	mockdate.set(fakeDate);
});

afterAll(() => {
	mockdate.reset();
});

describe('Roster', () => {
	it('matches snapshot', () => {
		const wrapper = mount(
			<MockedProvider mocks={mocks}>
				<BrowserRouter>
					<Roster />
				</BrowserRouter>
			</MockedProvider>
		);
		expect(wrapper).toMatchSnapshot();
		wrapper.unmount();
	});

	it('renders intro text with the correct number of kids', async () => {
		const wrapper = mount(
			<MockedProvider mocks={mocks} addTypename={false}>
				<BrowserRouter>
					<Roster />
				</BrowserRouter>
			</MockedProvider>
		);
		await act(async () => {
			await waitForUpdate(wrapper);
		});
		const introSpanText = wrapper.find('.usa-intro span').text();
		expect(introSpanText).toBe('2 kids enrolled.');
		wrapper.unmount();
	});

	it('updates the number of kids', async () => {
		const wrapper = mount(
			<MockedProvider mocks={mocks} addTypename={false}>
				<BrowserRouter>
					<Roster />
				</BrowserRouter>
			</MockedProvider>
		);
		await act(async () => {
			await waitForUpdate(wrapper);
			wrapper
				.find('Button')
				.first()
				.props()
				.onClick();
			await waitForUpdate(wrapper);
		});

		const radioGroup = wrapper.find(RadioGroup);

		await act(async () => {
			radioGroup.props().onChange({ target: { value: 'range' } });
			await waitForUpdate(wrapper);
			wrapper
				.find(DateSelectionForm)
				.props()
				.onSubmit({
					startDate: moment('2018-01-01'),
					endDate: moment('2019-02-01'),
				});
			await waitForUpdate(wrapper);
		});

		const introSpanText = wrapper.find('.usa-intro span').text();
		expect(introSpanText).toBe('1 kid was enrolled between January 1, 2018 and February 1, 2019.');
		wrapper.unmount();
	});
});
