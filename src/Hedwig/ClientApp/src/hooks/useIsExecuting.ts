import { useState, FormEvent } from 'react';

type IsExecuting = {
	isExecuting: boolean;
	setExecuting: (e: FormEvent) => any;
};

export default function useIsExecuting(callback: () => Promise<any | void | undefined>): IsExecuting {
	const [isExecuting, _setExecuting] = useState<any>(false);

	const setExecuting = (e: FormEvent) => {
		e.preventDefault();
		_setExecuting(true);
		callback().finally(() => _setExecuting(false));
	};
	return { isExecuting, setExecuting };
}
