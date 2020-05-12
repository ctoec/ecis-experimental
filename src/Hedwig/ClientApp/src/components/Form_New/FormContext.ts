import { createContext, Context, useContext } from 'react';

type FormContextType = {
	data: any;
	updateData: (_: any) => void
}

export type GenericFormContextType<T> = {
	data: T,
	updateData: (_: T) => void
}

const FormContext = createContext<FormContextType>({
	data: undefined,
	updateData: _ => {},
});

export const { Provider: FormProvider, Consumer: FormConsumer } = FormContext;
export default FormContext;

/**
 * Utility for allowing generics in type parameter on context types
 * @param context
 */
export function useGenericContext<S>(context: Context<any>) {
	const processedContext = useContext(context);
	return processedContext as GenericFormContextType<S>;
}
