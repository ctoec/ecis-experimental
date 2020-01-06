import { useEffect, DependencyList } from 'react';

export function useFocusFirstError(deps?: DependencyList | undefined) {
	return useEffect(() => {
		const input = document.getElementsByClassName('usa-input--error')[0];
		if (input) { (input as HTMLElement).focus() }
	}, deps);
}
