import { useContext, Context } from 'react';

export default function _useContext<S>(context: Context<any>) {
	const processedContext = useContext(context);
	return processedContext as S;
}
