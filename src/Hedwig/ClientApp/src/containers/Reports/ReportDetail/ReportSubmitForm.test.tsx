import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import 'react-dates/initialize';
import ReportSubmitForm from './ReportSubmitForm';
import CommonContextProviderMock from '../../../contexts/__mocks__/CommonContextProviderMock';
import { defaultReport } from '../../../hooks/__mocks__/useApi';
import { DeepNonUndefineable } from '../../../utils/types';
import { CdcReport } from '../../../generated';

jest.mock('../../../hooks/useApi');

afterAll(() => {
	jest.resetModules();
});

describe('ReportSubmitForm', () => {
	it('matches snapshot', () => {
		const { asFragment } = render(
			<CommonContextProviderMock>
				<ReportSubmitForm
					report={defaultReport as DeepNonUndefineable<CdcReport>}
					mutate={() => Promise.resolve()}
					canSubmit={true}
				/>
			</CommonContextProviderMock>
		);
		expect(asFragment()).toMatchSnapshot();
	});

	it('updates rates if accreditation is changed', () => {
		const { getByText, getByLabelText } = render(
			<CommonContextProviderMock>
				<ReportSubmitForm
					report={defaultReport as DeepNonUndefineable<CdcReport>}
					mutate={() => Promise.resolve()}
					canSubmit={true}
				/>
			</CommonContextProviderMock>
		);

		expect(getByText('Preschool').closest('tr')).toHaveTextContent('$165.32');

		fireEvent.click(getByLabelText('Accredited'));

		expect(getByText('Preschool').closest('tr')).toHaveTextContent('$126.59');
	});

	it('pretty formats currency values', () => {
		const { getByLabelText } = render(
			<CommonContextProviderMock>
				<ReportSubmitForm
					report={defaultReport as DeepNonUndefineable<CdcReport>}
					mutate={() => Promise.resolve()}
					canSubmit={true}
				/>
			</CommonContextProviderMock>
		);

		fireEvent.change(getByLabelText('Family Fees'), { target: { value: '12,34a.5' } });
		fireEvent.blur(getByLabelText('Family Fees'));

		expect(getByLabelText('Family Fees')).toHaveValue('$1,234.50');
	});
});
