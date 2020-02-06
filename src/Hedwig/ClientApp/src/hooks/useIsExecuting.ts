import { useState, FormEvent } from 'react';

type IsExecuting = {
	isExecuting: boolean;
	updateIsExecuting: (e: FormEvent) => any;
};

export default function useIsExecuting(callback: () => Promise<any>): IsExecuting {
	const [isExecuting, _updateIsExecuting] = useState<any>(false);

	const updateIsExecuting = (e: FormEvent) => {
		e.preventDefault();
		_updateIsExecuting(true);
		callback().finally(() => _updateIsExecuting(false));
	};
	return { isExecuting, updateIsExecuting };
}
