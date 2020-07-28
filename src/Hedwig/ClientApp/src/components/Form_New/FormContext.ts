import { createContext, Context, useContext } from 'react';
import { TObjectDriller } from './ObjectDriller';

/**
 * FormContext provides form data, data accessor, and data update function to any
 * components that are children of a Form
 *
 * @property data The data being tracked (displayed and updated) by the form.
 * This data should only get immutable updates, via the provided updateData function.
 *
 * @property dataDriller ObjectDriller wrapper on form data, provided for convenience
 * to save all custom form fields from needing to create one.
 *
 * @property updateData Immutable update function for form data
 */
type FormContextType = {
	data: any;
	dataDriller: any;
	updateData: React.Dispatch<React.SetStateAction<any>>;
};

/**
 * The generic form context type, to support parameterized types for the context
 */
export type GenericFormContextType<T> = {
	data: T;
	dataDriller: TObjectDriller<NonNullable<T>>;
	// Allows for function style update (setState(s => s) as opposed to setState(s))
	// Needed for components that make multiple edits to the same object
	// Otherwise just passing the object would result in one of the updates being
	// overwritten.
	updateData: React.Dispatch<React.SetStateAction<T>>;
};
/**
 * Utility for casting the un-typed context to the generic with type parameter,
 * so that form consumers can have type-constrained data, dataDriller, and updateData
 * @param context
 */
export function useGenericContext<S>(context: Context<any>) {
	const processedContext = useContext(context);
	return processedContext as GenericFormContextType<S>;
}

const FormContext = createContext<FormContextType>({
	data: undefined,
	dataDriller: undefined,
	updateData: (_) => {},
});

export const { Provider: FormProvider, Consumer: FormConsumer } = FormContext;
export default FormContext;
