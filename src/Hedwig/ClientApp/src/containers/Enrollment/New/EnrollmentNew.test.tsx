import React from 'react';
import mockdate from 'mockdate';
import { createBrowserHistory, createMemoryHistory } from 'history';
import { render, fireEvent, waitForElement, getAllByRole, act, wait, getByDisplayValue } from '@testing-library/react';
import 'react-dates/initialize';
import CommonContextProviderMock, {
	defaultCdcReportingPeriods,
} from '../../../contexts/__mocks__/CommonContextProviderMock';
import {
	completeEnrollment,
	enrollmentMissingFirstName,
	enrollmentMissingAddress,
	enrollmentWithFoster,
} from '../../../hooks/__mocks__/useApi';
import EnrollmentNew from './EnrollmentNew';
import { Route } from 'react-router';
// import { act } from 'react-dom/test-utils';

const fakeDate = '2019-03-02';

jest.mock('../../../hooks/useApi');

beforeAll(() => {
	mockdate.set(fakeDate);
});

afterAll(() => {
	mockdate.reset();
	jest.resetModules();
});

// const history = createBrowserHistory();

describe('EnrollmentNew', () => {
	it('does not skip family income section when lives with foster family is not selected', async () => {
		const history = createBrowserHistory();
		const { getByText } = render(
			<CommonContextProviderMock>
				<EnrollmentNew
					history={history}
					match={{
						params: {
							siteId: 1,
							enrollmentId: completeEnrollment.id,
							sectionId: 'family-information',
						},
					}}
				/>
			</CommonContextProviderMock>
		);

		const saveBtn = getByText(/Save/i);
		fireEvent.click(saveBtn);

		await wait();

		expect(history.location.pathname).toMatch(/family-income/i)
	});

	it('skips family income section when lives with foster family is selected', async () => {
		const history = createMemoryHistory();
		const enrollment = enrollmentWithFoster;
		history.push(`/roster/sites/${enrollment.siteId}/enrollments/${enrollment.id}/new/family-information`);
		const { findByLabelText, getByDisplayValue } = render(
			<CommonContextProviderMock
				history={history}
			>
				<Route
					path={'/roster/sites/:siteId/enrollments/:enrollmentId/new/:sectionId'}
					render={props => <EnrollmentNew
						history={props.history}
						match={{
							params: {
								siteId: props.match.params.siteId,
								// Throws 'TypeError: Invalid attempt to destructure non-iterable instance' if we try to read from the props
								// I have no idea why??
								enrollmentId: enrollment.id,
								sectionId: props.match.params.sectionId,
							},
						}}
					/>}
				/>
			</CommonContextProviderMock>
		);

		const fosterCheckbox = await findByLabelText(/Child lives with foster family/i);
		expect((fosterCheckbox as HTMLInputElement).checked).toBeTruthy();

		const saveBtn = getByDisplayValue(/Save/i);
		fireEvent.click(saveBtn);

		await wait();

		expect(history.location.pathname).toMatch(/enrollment-funding/i)
	});
});