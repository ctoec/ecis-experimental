import React from 'react';
import { mount } from 'enzyme';
import mockdate from 'mockdate';
import { BrowserRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import 'react-dates/initialize';
import Roster from './Roster';
import UserContext from '../../contexts/User/UserContext';
import RadioGroup from '../../components/RadioGroup/RadioGroup';

const fakeDate = '2019-09-30';

const user: User = {
	id: 1,
	wingedKeysId: emptyGuid(),
	firstName: 'Minerva',
	lastName: 'McGonagall',
	orgPermissions: [
		{
			organizationId: 1,
			organization: {
				id: 1,
				name: "Children's Adventure Center",
				sites: [
					{
						id: 1,
						name: "Children's Adventure Center",
						organizationId: 1,
						region: Region.East,
						titleI: false,
					},
				],
			},
			id: 1,
			userId: 1,
		},
	],
	sitePermissions: [],
};

const waitForUpdate = async (wrapper: any) => {
	await new Promise(resolve => setTimeout(resolve, 10));
	wrapper.update();
};

// https://github.com/facebook/jest/issues/5579
jest.mock('../../hooks/useApi', () => {
	const moment = require('moment');
	return {
		__esModule: true,
		default: (callback: any, dependencies: any[]) => {
			return callback(
				{
					apiOrganizationsOrgIdSitesIdGet: (params: any) => [
						false,
						null,
						{
							id: 1,
							name: "Children's Adventure Center",
							organizationId: 1,
							enrollments: undefined,
							organization: undefined,
						},
					],
					apiOrganizationsOrgIdSitesSiteIdEnrollmentsGet: (params: any) => [
						false,
						null,
						[
							{
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
								siteId: 1,
							},
							{
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
							},
						].filter(e => {
							return (
								(!e.entry ? true : moment(e.entry).isBefore(params.endDate)) &&
								(!e.exit ? true : moment(e.exit).isAfter(moment(params.startDate)))
							);
						}),
					],
				},
				[]
			);
		},
	};
});

import useApi from '../../hooks/useApi';
import { User, Region } from '../../generated';
import emptyGuid from '../../utils/emptyGuid';

beforeAll(() => {
	mockdate.set(fakeDate);
});

afterAll(() => {
	mockdate.reset();
	jest.resetModules();
});

describe('Roster', () => {
	it('matches snapshot', () => {
		const wrapper = mount(
			<UserContext.Provider value={{ user }}>
				<BrowserRouter>
					<Roster />
				</BrowserRouter>
			</UserContext.Provider>
		);
		expect(wrapper.html()).toMatchSnapshot();
		wrapper.unmount();
	});

	it('renders intro text with the correct number of children', async () => {
		const wrapper = mount(
			<UserContext.Provider value={{ user }}>
				<BrowserRouter>
					<Roster />
				</BrowserRouter>
			</UserContext.Provider>
		);
		await act(async () => {
			await waitForUpdate(wrapper);
		});
		const introSpanText = wrapper.find('.usa-intro span').text();
		expect(introSpanText).toBe('2 children enrolled.');
		wrapper.unmount();
	});

	it('updates the number of children', async () => {
		const wrapper = mount(
			<UserContext.Provider value={{ user }}>
				<BrowserRouter>
					<Roster />
				</BrowserRouter>
			</UserContext.Provider>
		);
		await act(async () => {
			await waitForUpdate(wrapper);
			wrapper
				.find('Button')
				.at(1)
				.props()
				.onClick();
			await waitForUpdate(wrapper);
		});

		const radioGroup = wrapper.find(RadioGroup);

		await act(async () => {
			radioGroup.props().onChange({ target: { value: 'range' } });
			await waitForUpdate(wrapper);
			const startDateInput = wrapper.find('input#enrollment-roster-datepicker-start-date');
			const endDateInput = wrapper.find('input#enrollment-roster-datepicker-end-date');
			startDateInput.simulate('change', { target: { value: '01/01/2018' } });
			endDateInput.simulate('change', { target: { value: '02/01/2019' } });
			await waitForUpdate(wrapper);
		});

		const introSpanText = wrapper.find('.usa-intro span').text();
		expect(introSpanText).toBe(
			'1 child was enrolled between January 1, 2018 and February 1, 2019.'
		);
		wrapper.unmount();
	});
});
