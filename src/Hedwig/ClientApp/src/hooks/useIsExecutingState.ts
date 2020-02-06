import { useEffect, useState } from 'react';

export default function useIsExecutingState(callback: (...args: any[]) => any) {
	const [isExecuting, updateIsExecuting] = useState(false);
	return {
		isExecuting,
		callback: (...args: any[]) => {
			updateIsExecuting(true);
			callback(...args);
			updateIsExecuting(false);
		},
	};
}
