import { useContext, Context } from 'react';

/**
 * Utility for allowing generics in type parameter on context types
 * @param context
 */
export default function _useContext<S>(context: Context<any>) {
	const processedContext = useContext(context);
	return processedContext as S;
}
