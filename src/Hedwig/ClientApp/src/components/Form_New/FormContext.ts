import { createContext, Context, useContext } from 'react';

type FormContextType = {
	data: any;
	updateData: (_: any) => void;
}

const FormContext = createContext<FormContextType>({
	data: undefined,
	updateData: _ => {},
});

export const { Provider: FormProvider, Consumer: FormConsumer } = FormContext;
export default FormContext;

/**
 * useContext does not support type parameters, so we have to create
 * an un-type-parameterized context, and then cast it to the generic type
 */
export type GenericFormContextType<T> = {
	data: T,
	updateData: (_: T) => void
}
/**
 * Utility for casting the un-typed context to the generic with type parameter
 * @param context
 */
export function useGenericContext<S>(context: Context<any>) {
	const processedContext = useContext(context);
	return processedContext as GenericFormContextType<S>;
}
