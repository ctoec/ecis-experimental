import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import 'react-dates/initialize';
import EnrollmentDetail from './EnrollmentDetail';
import UserContext from '../../../contexts/User/UserContext';
import { User, Region } from '../../../generated';
import emptyGuid from '../../../utils/emptyGuid';

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

// https://github.com/facebook/jest/issues/5579
jest.mock('../../../hooks/useApi', () => {
	return {
		__esModule: true,
		default: (callback: any, dependencies: any[]) => {
			return callback(
				{
					apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGet: (params: any) => [
						false,
						null,
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
					],
				},
				[]
			);
		},
	};
});

import useApi from '../../../hooks/useApi';

beforeAll(() => {
	// mockdate.set(fakeDate);
});

afterAll(() => {
	// mockdate.reset();
	jest.resetModules();
});

describe('EnrollmentDetail', () => {
	it('matches snapshot', () => {
		const wrapper = mount(
			<UserContext.Provider value={{ user }}>
				<BrowserRouter>
					<EnrollmentDetail match={{ params: { enrollmentId: 2 } }} />
				</BrowserRouter>
			</UserContext.Provider>
		);
		console.log(wrapper.debug());
		expect(wrapper.html()).toMatchSnapshot();
		wrapper.unmount();
	});
});
