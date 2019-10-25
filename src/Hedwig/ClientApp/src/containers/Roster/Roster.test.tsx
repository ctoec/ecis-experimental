import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import Roster, { ROSTER_QUERY } from './Roster';
import moment from 'moment';

const fakeEnrollmentData = {
	me: {
		sites: [
			{
				id: 1,
				name: 'Site 1',
				enrollments: [
					{
						child: {
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
					},
					{
						child: {
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
								source: 'Gringotts Goblins Grant for Gifted Girls',
							},
						],
						id: 2,
					},
				],
			},
		],
	},
};

const mocks = [
	{
		request: {
			query: ROSTER_QUERY,
			variables: {
				from: moment()
					.local()
					.format('YYYY-MM-DD'),
				to: moment()
					.local()
					.format('YYYY-MM-DD'),
			},
		},
		result: {
			data: fakeEnrollmentData,
		},
	},
];

const waitForUpdate = async (wrapper: any) => {
	await new Promise(resolve => setTimeout(resolve, 10));
	wrapper.update();
};

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

	it('renders a title with the number of kids', async () => {
		const wrapper = mount(
			<MockedProvider mocks={mocks} addTypename={false}>
				<BrowserRouter>
					<Roster />
				</BrowserRouter>
			</MockedProvider>
		);
		await waitForUpdate(wrapper);
		const introSpanText = wrapper.find('.usa-intro span').text();
		expect(introSpanText).toBe('2 kids enrolled.');
		wrapper.unmount();
	});
});
