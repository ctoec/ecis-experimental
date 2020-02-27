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

			const firstNameInput = (await findByText('First name')).closest('div');
			expect(firstNameInput).toHaveTextContent('This information is required for enrollment');
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

			const lastNameInput = (await findByText('Last name')).closest('div');
			expect(lastNameInput).toHaveTextContent('This information is required for enrollment');
		});
	});
});
