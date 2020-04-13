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

/**
 * Component for grouping form fields and adding fieldsets
 * @param props
 */
function FormInset<TData, TAdditionalData = {}>({
	render,
}: FormInsetProps<TData, TAdditionalData>) {
	// Use non-React useContext to allow for generics in type parameter
	const { data, additionalInformation } = useContext<
		GenericFormContextType<TData, never, TAdditionalData>
	>(FormContext);

	const renderProps = {
		containingData: data,
		additionalInformation,
	};

	return render(renderProps);
}

export default FormInset;
