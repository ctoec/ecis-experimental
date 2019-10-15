import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import Reports from './Reports';
import { REPORTS_QUERY } from './Reports';

const mocks = [
	{
		request: {
			query: REPORTS_QUERY,
		},
		result: {
			data: {
				user: {
					reports: [
						{
							id: 1,
							type: 'CDC',
							period: '2019-08-01',
							periodStart: '2019-07-29',
							periodEnd: '2019-09-01',
							dueAt: '2019-09-15',
							submittedAt: '2019-09-09',
							organization: {
								id: 1,
								name: "Children's Adventure Center",
							},
						},
						{
							id: 2,
							type: 'CDC',
							period: '2019-09-01',
							periodStart: '2019-09-02',
							periodEnd: '2019-09-29',
							dueAt: '2019-10-15',
							submittedAt: null,
							organization: {
								id: 1,
								name: "Children's Adventure Center",
							},
						},
					],
				},
			},
		},
	},
];

it('matches snapshot', () => {
	const wrapper = mount(
		<MockedProvider mocks={mocks}>
			<BrowserRouter>
				<Reports />
			</BrowserRouter>
		</MockedProvider>
	);
	expect(wrapper).toMatchSnapshot();
});
