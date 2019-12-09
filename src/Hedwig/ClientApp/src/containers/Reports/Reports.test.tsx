import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter } from 'react-router-dom';
import 'react-dates/initialize';
import Reports from './Reports';
import UserContext from '../../contexts/User/UserContext';

const user = {
  id: 1,
  firstName: 'Minerva',
  lastName: 'McGonagall',
  orgPermissions: [
    {
      organizationId: 1,
      organization: {
        id: 1,
        name: "Children's Adventure Center",
        sites: [{ id: 1, name: "Children's Adventure Center", organizationId: 1 }],
      },
      id: 1,
      userId: 1,
    },
  ],
  sitePermissions: [],
};

// https://github.com/facebook/jest/issues/5579
jest.mock('../../hooks/useApi', () => {
  const _moment = require('moment');
  const moment = (_: any) => {
    return {
      ..._moment(_),
      getMonth: () => _moment(_).month()
    }
  }
  return {
    __esModule: true,
    default: (callback: any, dependencies: any[]) => {
      return callback(
        {
          apiOrganizationsIdGet: (params: any) => [
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
          apiOrganizationsOrgIdReportsGet: (params: any) => [
            false,
            null,
            [
              {
                id: 1,
                type: 'CDC',
                reportingPeriod: {
                  period: moment('2019-08-01'),
                  periodStart: moment('2019-07-29'),
                  periodEnd: moment('2019-09-01'),
                  dueAt: moment('2019-09-15'),
                },
                submittedAt: '2019-09-09',
                organization: {
                  id: 1,
                  name: "Children's Adventure Center",
                },
              },
              {
                id: 2,
                type: 'CDC',
                reportingPeriod: {
                  period: moment('2019-09-01'),
                  periodStart: moment('2019-09-02'),
                  periodEnd: moment('2019-09-29'),
                  dueAt: moment('2019-10-15'),
                },
                submittedAt: null,
                organization: {
                  id: 1,
                  name: "Children's Adventure Center",
                },
              },
            ],
          ],
        },
        []
      );
    },
  };
});

import useApi from '../../hooks/useApi';

afterAll(() => {
  jest.resetModules();
});

describe('Roster', () => {
  it('matches snapshot', () => {
    const wrapper = mount(
      <UserContext.Provider value={{ user }}>
        <BrowserRouter>
          <Reports />
        </BrowserRouter>
      </UserContext.Provider>
    );
    expect(wrapper.html()).toMatchSnapshot();
    wrapper.unmount();
  });
});