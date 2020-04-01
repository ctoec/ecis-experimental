import React from 'react';
import { FormContext, GenericFormContextType } from './Form';
import useContext from '../../utils/useContext';

type FormInsetComponentProps<TData> = {
	containingData: TData;
};

type FormInsetProps<TData, TAdditionalData> = {
	render: (
		_: FormInsetComponentProps<TData> & {
			additionalInformation: TAdditionalData;
		}
	) => React.ReactElement | null;
};

function FormInset<TData, TAdditionalData = {}>({
	render,
}: FormInsetProps<TData, TAdditionalData>) {
	const { data, additionalInformation } = useContext<GenericFormContextType<TAdditionalData>>(
		FormContext
	);

	const renderProps = {
		containingData: data,
		additionalInformation,
	};

	return render(renderProps);
}

export default FormInset;
