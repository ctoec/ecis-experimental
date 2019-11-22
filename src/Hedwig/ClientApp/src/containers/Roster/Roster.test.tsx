import React from 'react';
import moment from 'moment';
import { mount } from 'enzyme';
import mockdate from 'mockdate';
import { BrowserRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import 'react-dates/initialize';
import Roster from './Roster';
import DateSelectionForm from './DateSelectionForm';
import RadioGroup from '../../components/RadioGroup/RadioGroup';
// import fakeData from '../../../../../../rest-backend/db.json';

const fakeDate = '2019-09-30';

const waitForUpdate = async (wrapper: any) => {
	await new Promise(resolve => setTimeout(resolve, 10));
	wrapper.update();
};

// TODO: get fake data from db.json instead
// https://github.com/facebook/jest/issues/5579
jest.mock('../../hooks/useOASClient', () => ({
  __esModule: true,
  default: () => {
    const fakeData = { id: 1, organizationId: 1, enrollments: [] };
    return {
      data: fakeData,
      runQuery: () => fakeData,
    };
  },
}));

import useOASClient from './../../hooks/useOASClient';

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
			<BrowserRouter>
				<Roster />
			</BrowserRouter>
		);
		// await act(async () => {
		waitForUpdate(wrapper);
		// });
		console.log(wrapper.debug());
		expect(wrapper).toMatchSnapshot();
		wrapper.unmount();
	});

	it('renders intro text with the correct number of kids', async () => {
		const wrapper = mount(
			<BrowserRouter>
				<Roster />
			</BrowserRouter>
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
			<BrowserRouter>
				<Roster />
			</BrowserRouter>
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

jest.spyOn(global, 'fetch').mockImplementation(() =>
	Promise.resolve({
		json: () => Promise.resolve(fakeData.siteHydrated),
	})
);
