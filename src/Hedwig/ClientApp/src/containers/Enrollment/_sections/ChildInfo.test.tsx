import React from 'react';
import { render } from '@testing-library/react';
import ChildInfo from './ChildInfo';
import { DeepNonUndefineable } from '../../../utils/types';
import { Enrollment } from '../../../generated';

jest.mock('../../../hooks/useApi');

describe('enrollment sections', () => {
	describe('ChildInfo', () => {
		it('shows an error if rendered without a child first name', async () => {
			const { findByText } = render(
				<ChildInfo.Form
					siteId={1}
					enrollment={{} as DeepNonUndefineable<Enrollment>}
					mutate={async () => {}}
					error={{
						errors: { 'Child.FirstName': ['error'] },
						status: 400,
					}}
				/>
			);

			// TODO: the id needs to be updated-- this will probably mess things up
			const firstNameErr = await findByText('This information is required for enrollment');
			expect(firstNameErr.id).toBe('child-firstname-error');
		});

		it('shows an error if rendered without a child last name', async () => {
			const { findByText } = render(
				<ChildInfo.Form
					siteId={1}
					enrollment={{} as DeepNonUndefineable<Enrollment>}
					mutate={async () => {}}
					error={{
						errors: { 'Child.LastName': ['error'] },
						status: 400,
					}}
				/>
			);

			const lastNameErr = await findByText('This information is required for enrollment');
			expect(lastNameErr.id).toBe('child-lastname-error');
		});
	});
});
