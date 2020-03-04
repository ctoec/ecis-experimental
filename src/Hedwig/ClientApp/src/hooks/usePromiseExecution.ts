import { useState, FormEvent } from 'react';

type IsExecuting = {
	isExecuting: boolean;
	setExecuting: (e: FormEvent) => any;
};

export default function usePromiseExecution(
	callback: () => Promise<any | void | undefined>
): IsExecuting {
	const [isExecuting, _setExecuting] = useState<any>(false);

	const setExecuting = (e: FormEvent) => {
		e.preventDefault();
		_setExecuting(true);
		// TODO: is this what is causing the memory leak error?
		callback().finally(() => _setExecuting(false));
	};
	return { isExecuting, setExecuting };
}
